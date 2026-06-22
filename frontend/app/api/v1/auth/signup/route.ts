import { NextResponse } from "next/server";
import { getSupabaseAdmin, json } from "../_lib";

export const dynamic = "force-dynamic";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

async function generateRegistrationNumber(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  tradeCode: string,
) {
  const yearCode = String(new Date().getFullYear()).slice(-2);
  const prefix = `${tradeCode}${yearCode}`;
  const { count } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .ilike("registration_number", `${prefix}%`);

  return `${prefix}${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, date_of_birth, trade_code } = body;

    if (!email || !password || !full_name || !date_of_birth || !trade_code) {
      return json(
        {
          error:
            "Full name, email, password, date of birth, and trade program are required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { firstName, lastName } = splitName(full_name);
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const requestedEmail = String(email).trim().toLowerCase();
    const role =
      superAdminEmail && requestedEmail === superAdminEmail
        ? "super_admin"
        : "student";

    const { data: trade, error: tradeError } = await supabase
      .from("trades")
      .select("id, code, name")
      .eq("code", trade_code)
      .eq("is_active", true)
      .maybeSingle();

    if (tradeError) {
      console.warn("Trade lookup failed during signup:", tradeError);
      return json(
        { error: "Unable to verify the selected trade program." },
        { status: 500 },
      );
    }

    if (role === "student" && !trade) {
      return json(
        { error: "Please select a valid active trade program." },
        { status: 400 },
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role,
          full_name,
          first_name: firstName,
          last_name: lastName,
          date_of_birth,
          trade_code,
        },
      });

    if (authError || !authData.user) {
      const authErrorMsg = authError?.message || "Unable to create account";
      const authErrorCode =
        (authError as any)?.status || (authError as any)?.code;
      const normalized = authErrorMsg.toLowerCase();

      // Log detailed error for debugging
      console.error("Supabase createUser error:", {
        message: authErrorMsg,
        code: authErrorCode,
        fullError: authError,
        authData,
      });

      return json(
        {
          error:
            normalized.includes("already") || normalized.includes("registered")
              ? "This email is already registered. Please sign in."
              : `Database error creating new user: ${authErrorMsg}`,
        },
        { status: 400 },
      );
    }

    const user = authData.user;

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email,
        full_name,
        role,
        is_active: true,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.warn("Profile creation failed during signup:", profileError);
      await supabase.auth.admin.deleteUser(user.id);
      return json(
        { error: "Unable to create profile for this account." },
        { status: 500 },
      );
    }

    let student: { id: number } | null = null;
    if (role === "student") {
      if (!trade) {
        return json(
          { error: "Please select a valid active trade program." },
          { status: 400 },
        );
      }

      const registrationNumber = await generateRegistrationNumber(
        supabase,
        trade.code,
      );
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert({
          user_id: user.id,
          registration_number: registrationNumber,
          first_name: firstName,
          last_name: lastName,
          date_of_birth,
          enrollment_status: "pending",
        })
        .select()
        .maybeSingle();

      if (studentError) {
        console.warn(
          "Student profile creation failed during signup:",
          studentError,
        );
        await supabase.auth.admin.deleteUser(user.id);
        return json(
          { error: "Unable to create student profile for this account." },
          { status: 500 },
        );
      }
      student = studentData;
    }

    if (role === "student" && trade?.id && student?.id) {
      const { error: enrollmentError } = await supabase
        .from("enrollments")
        .insert({
          student_id: student.id,
          trade_id: trade.id,
          enrollment_date: new Date().toISOString(),
          status: "active",
        });

      if (enrollmentError) {
        console.warn(
          "Enrollment creation failed during signup:",
          enrollmentError,
        );
        await supabase.auth.admin.deleteUser(user.id);
        return json(
          { error: "Unable to enroll this account in the selected program." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        data: {
          user: { id: user.id, email: user.email },
          student: student ?? null,
          requires_email_confirmation: false,
          message: "Account created successfully. You can sign in now.",
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup route exception:", error);
    const errorMsg = error?.message || error?.toString?.() || "Signup failed";
    return json(
      {
        error: `Signup failed: ${errorMsg}`,
      },
      { status: 500 },
    );
  }
}
