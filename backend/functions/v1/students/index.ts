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

  // Get student dashboard data
  if (req.method === "GET") {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      // Get student dashboard data
      const { data: dashboard, error } = await supabase.rpc('get_student_dashboard', {
        p_user_id: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: dashboard });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Register new student
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const {
        email,
        password,
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact,
        guardian_contact,
        address,
        academic_background,
        trade_code,
      } = body;

      // Validate required fields
      if (!email || !password || !first_name || !last_name || !date_of_birth || !trade_code) {
        return json({ error: "Missing required fields" }, 400);
      }

      // Validate trade exists
      const { data: trade, error: tradeErr } = await supabase
        .from("trades")
        .select("id, code, name")
        .eq("code", trade_code)
        .eq("is_active", true)
        .maybeSingle();

      if (tradeErr || !trade) {
        return json({ error: "Invalid or inactive trade code" }, 400);
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student',
            student_data: {
              first_name,
              last_name,
              date_of_birth,
              gender,
              contact,
              guardian_contact,
              address,
              academic_background,
              trade_code,
            }
          }
        }
      });

      if (authError) {
        return json({ error: authError.message }, 400);
      }

      if (!authData.user) {
        return json({ error: "Failed to create user account" }, 400);
      }

      // The student profile will be created automatically by the trigger
      // Get the created student profile
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select(`
          id,
          registration_number,
          first_name,
          last_name,
          enrollment_status,
          created_at,
          trades:enrollments!inner(trade_id, trades(name, code))
        `)
        .eq("user_id", authData.user.id)
        .single();

      if (studentError) {
        return json({ error: "Student profile creation failed" }, 400);
      }

      return json({
        data: {
          user: authData.user,
          student,
          message: "Student registered successfully. Please check your email for verification."
        }
      });

    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Update student profile
  if (req.method === "PUT") {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const body = await req.json();
      const { contact, guardian_contact, address, academic_background } = body;

      const { data, error } = await supabase.rpc('update_student_profile', {
        p_user_id: user.id,
        p_contact: contact,
        p_guardian_contact: guardian_contact,
        p_address: address,
        p_academic_background: academic_background
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Profile updated successfully" } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get student's courses
  if (req.method === "GET" && req.url.includes("/courses")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const { data: courses, error } = await supabase.rpc('get_student_courses', {
        p_user_id: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: courses });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get student's course modules
  if (req.method === "GET" && req.url.includes("/modules")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const url = new URL(req.url);
      const courseId = url.searchParams.get("course_id");

      if (!courseId) return json({ error: "course_id parameter required" }, 400);

      const { data: modules, error } = await supabase.rpc('get_student_course_modules', {
        p_user_id: user.id,
        p_course_id: parseInt(courseId)
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: modules });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Update student progress
  if (req.method === "POST" && req.url.includes("/progress")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const body = await req.json();
      const { course_enrollment_id, module_id, progress_percentage, status, time_spent } = body;

      const { data, error } = await supabase.rpc('update_student_progress', {
        p_course_enrollment_id: course_enrollment_id,
        p_module_id: module_id,
        p_progress_percentage: progress_percentage,
        p_status: status,
        p_time_spent: time_spent
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Progress updated successfully" } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  return json({ error: "Method not allowed" }, 405);
});
