import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (req.method === "POST") {
    const body = await req.json();
    const {
      first_name,
      last_name,
      dob,
      gender,
      contact,
      guardian,
      trade_code,
    } = body;

    // Resolve trade_id by code
    const { data: trade, error: tradeErr } = await supabase
      .from("trades")
      .select("id, code")
      .eq("code", trade_code)
      .maybeSingle();
    if (tradeErr || !trade) return json({ error: "Invalid trade_code" }, 400);

    // Generate registration number inside DB function
    const { data: reg, error: regErr } = await supabase.rpc(
      "gen_student_reg_number",
      {
        p_trade_id: trade.id,
      }
    );
    if (regErr || !reg)
      return json({ error: "Failed to generate reg number" }, 400);

    const { data: student, error } = await supabase
      .from("students")
      .insert({
        registration_number: reg as string,
        first_name,
        last_name,
        dob,
        gender,
        contact,
        guardian,
      })
      .select()
      .single();

    if (error) return json({ error: error.message }, 400);

    // Optional: auto-enrollment
    await supabase.from("enrollments").insert({
      student_id: student.id,
      trade_id: trade.id,
      start_date: new Date().toISOString().slice(0, 10),
      status: "enrolled",
    });

    return json({ data: student });
  }

  return json({ error: "Method not allowed" }, 405);
});
