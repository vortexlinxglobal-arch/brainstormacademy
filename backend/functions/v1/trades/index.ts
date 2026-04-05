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

  // Get all active trades
  if (req.method === "GET" && !req.url.includes("/courses") && !req.url.includes("/categories")) {
    try {
      const { data: trades, error } = await supabase
        .from("trade_catalog")
        .select("*")
        .order("name");

      if (error) return json({ error: error.message }, 400);

      return json({ data: trades });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get trade categories
  if (req.method === "GET" && req.url.includes("/categories")) {
    try {
      const { data: categories, error } = await supabase
        .from("trade_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) return json({ error: error.message }, 400);

      return json({ data: categories });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get courses for a trade
  if (req.method === "GET" && req.url.includes("/courses")) {
    try {
      const url = new URL(req.url);
      const tradeCode = url.searchParams.get("trade_code");

      if (!tradeCode) return json({ error: "trade_code parameter required" }, 400);

      const { data: courses, error } = await supabase
        .from("course_catalog")
        .select("*")
        .eq("trade_code", tradeCode)
        .order("order_index");

      if (error) return json({ error: error.message }, 400);

      return json({ data: courses });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Create new trade (staff/admin only)
  if (req.method === "POST" && !req.url.includes("/courses")) {
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

      const body = await req.json();
      const {
        category_code,
        code,
        name,
        description,
        duration_months,
        tuition_fee,
        prerequisites,
        curriculum,
      } = body;

      // Validate required fields
      if (!category_code || !code || !name || !duration_months) {
        return json({ error: "Missing required fields" }, 400);
      }

      const { data: tradeId, error } = await supabase.rpc('create_trade', {
        p_category_code: category_code,
        p_code: code,
        p_name: name,
        p_description: description,
        p_duration_months: duration_months,
        p_tuition_fee: tuition_fee,
        p_prerequisites: prerequisites,
        p_curriculum: curriculum,
        p_created_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      // Get the created trade
      const { data: trade, error: tradeErr } = await supabase
        .from("trades")
        .select("*")
        .eq("id", tradeId)
        .single();

      if (tradeErr) return json({ error: tradeErr.message }, 400);

      return json({
        data: trade,
        message: "Trade created successfully"
      });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Update trade (staff/admin only)
  if (req.method === "PUT") {
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

      const body = await req.json();
      const {
        trade_id,
        name,
        description,
        duration_months,
        tuition_fee,
        prerequisites,
        curriculum,
        is_active,
      } = body;

      if (!trade_id) return json({ error: "trade_id is required" }, 400);

      const { data, error } = await supabase.rpc('update_trade', {
        p_trade_id: trade_id,
        p_name: name,
        p_description: description,
        p_duration_months: duration_months,
        p_tuition_fee: tuition_fee,
        p_prerequisites: prerequisites,
        p_curriculum: curriculum,
        p_is_active: is_active,
        p_updated_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Trade updated successfully" } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Create course (staff/admin only)
  if (req.method === "POST" && req.url.includes("/courses")) {
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

      const body = await req.json();
      const {
        trade_code,
        code,
        title,
        description,
        instructor_id,
        duration_hours,
        credit_hours,
        course_fee,
        materials,
        prerequisites,
      } = body;

      // Validate required fields
      if (!trade_code || !code || !title) {
        return json({ error: "Missing required fields" }, 400);
      }

      const { data: courseId, error } = await supabase.rpc('create_course', {
        p_trade_code: trade_code,
        p_code: code,
        p_title: title,
        p_description: description,
        p_instructor_id: instructor_id,
        p_duration_hours: duration_hours,
        p_credit_hours: credit_hours,
        p_course_fee: course_fee,
        p_materials: materials,
        p_prerequisites: prerequisites,
        p_created_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      // Get the created course
      const { data: course, error: courseErr } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseErr) return json({ error: courseErr.message }, 400);

      return json({
        data: course,
        message: "Course created successfully"
      });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Add course module (staff/admin only)
  if (req.method === "POST" && req.url.includes("/modules")) {
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

      const body = await req.json();
      const {
        course_code,
        title,
        description,
        order_index,
        content,
        duration_hours,
      } = body;

      // Validate required fields
      if (!course_code || !title || order_index === undefined) {
        return json({ error: "Missing required fields" }, 400);
      }

      const { data: moduleId, error } = await supabase.rpc('add_course_module', {
        p_course_code: course_code,
        p_title: title,
        p_description: description,
        p_order_index: order_index,
        p_content: content,
        p_duration_hours: duration_hours,
        p_created_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      // Get the created module
      const { data: module, error: moduleErr } = await supabase
        .from("course_modules")
        .select("*")
        .eq("id", moduleId)
        .single();

      if (moduleErr) return json({ error: moduleErr.message }, 400);

      return json({
        data: module,
        message: "Course module added successfully"
      });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  return json({ error: "Method not allowed" }, 405);
});