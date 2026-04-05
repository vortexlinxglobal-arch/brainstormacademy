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

  // Get staff dashboard data
  if (req.method === "GET") {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      // Get staff dashboard data
      const { data: dashboard, error } = await supabase.rpc('get_staff_dashboard', {
        p_user_id: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: dashboard });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Register new staff member
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const {
        email,
        password,
        full_name,
        category_code,
        department_code,
        bio,
        employment_date,
        specialty,
        qualifications,
      } = body;

      // Validate required fields
      if (!email || !password || !full_name || !category_code) {
        return json({ error: "Missing required fields" }, 400);
      }

      // Validate staff category exists
      const { data: category, error: catErr } = await supabase
        .from("staff_categories")
        .select("id, code, name")
        .eq("code", category_code)
        .maybeSingle();

      if (catErr || !category) {
        return json({ error: "Invalid staff category code" }, 400);
      }

      // Validate department if required
      let department_id = null;
      if (department_code) {
        const { data: dept, error: deptErr } = await supabase
          .from("departments")
          .select("id, code, name")
          .eq("code", department_code)
          .maybeSingle();

        if (deptErr || !dept) {
          return json({ error: "Invalid department code" }, 400);
        }
        department_id = dept.id;
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'staff',
            staff_data: {
              category_code,
              department_code,
              bio,
              employment_date,
              specialty,
              qualifications,
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

      // The staff profile will be created automatically by the trigger
      // Get the created staff profile
      const { data: staff, error: staffError } = await supabase
        .from("staff_profiles")
        .select(`
          id,
          employee_id,
          department:departments(name, code),
          category:staff_categories(name, code),
          bio,
          employment_date,
          specialty,
          qualifications,
          performance_rating,
          created_at
        `)
        .eq("user_id", authData.user.id)
        .single();

      if (staffError) {
        return json({ error: "Staff profile creation failed" }, 400);
      }

      return json({
        data: {
          user: authData.user,
          staff,
          message: "Staff member registered successfully. Please check your email for verification."
        }
      });

    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Update staff profile
  if (req.method === "PUT") {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const body = await req.json();
      const { bio, specialty, qualifications } = body;

      // Update staff profile
      const { data, error } = await supabase
        .from("staff_profiles")
        .update({
          bio,
          specialty,
          qualifications,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Profile updated successfully", staff: data } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get staff by department (admin/staff only)
  if (req.method === "GET" && req.url.includes("/department")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      // Check if user is staff/admin
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr || !['staff', 'admin'].includes(profile.role)) {
        return json({ error: "Access denied" }, 403);
      }

      const url = new URL(req.url);
      const departmentCode = url.searchParams.get("code");

      if (!departmentCode) return json({ error: "department code parameter required" }, 400);

      const { data: staff, error } = await supabase.rpc('get_staff_by_department', {
        p_department_code: departmentCode
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: staff });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Update staff performance rating (admin only)
  if (req.method === "POST" && req.url.includes("/performance")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      // Check if user is admin
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr || profile.role !== 'admin') {
        return json({ error: "Access denied" }, 403);
      }

      const body = await req.json();
      const { staff_id, rating } = body;

      if (!staff_id || rating === undefined) {
        return json({ error: "staff_id and rating are required" }, 400);
      }

      const { data, error } = await supabase.rpc('update_staff_performance', {
        p_staff_id: staff_id,
        p_rating: rating,
        p_updated_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Performance rating updated successfully" } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  return json({ error: "Method not allowed" }, 405);
});
