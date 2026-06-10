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

  // Submit admissions application
  if (req.method === "POST" && !req.url.includes("/review") && !req.url.includes("/letter")) {
    try {
      const body = await req.json();
      const {
        applicant_name,
        applicant_email,
        phone,
        date_of_birth,
        address,
        education_background,
        trade_interest,
        previous_experience,
        motivation_statement,
        special_needs,
        emergency_contact,
      } = body;

      // Validate required fields
      if (!applicant_name || !applicant_email || !trade_interest) {
        return json({ error: "Missing required fields" }, 400);
      }

      // Validate trade selection
      const { data: trade, error: tradeError } = await supabase
        .from('trades')
        .select('code')
        .eq('code', trade_interest)
        .eq('is_active', true)
        .single();

      if (tradeError) return json({ error: tradeError.message }, 400);
      if (!trade) return json({ error: 'Invalid trade selection' }, 400);

      const applicationPayload = {
        applicant_name,
        applicant_email,
        phone,
        date_of_birth,
        address,
        education_background,
        trade_interest,
        previous_experience,
        motivation_statement,
        special_needs,
        emergency_contact,
      };

      const { data: application, error } = await supabase
        .from('admissions_applications')
        .insert([applicationPayload])
        .select('id')
        .single();

      if (error) return json({ error: error.message }, 400);

      return json({
        data: {
          application,
          message: "Application submitted successfully. You will receive a confirmation email shortly."
        }
      });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Review admissions application (staff/admin only)
  if (req.method === "POST" && req.url.includes("/review")) {
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
      const { application_id, status, decision_notes } = body;

      if (!application_id || !status) {
        return json({ error: "application_id and status are required" }, 400);
      }

      const { data, error } = await supabase.rpc('review_admissions_application', {
        p_application_id: application_id,
        p_status: status,
        p_decision_notes: decision_notes,
        p_reviewed_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: { success: true, message: "Application reviewed successfully" } });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Generate admission letter (staff/admin only)
  if (req.method === "POST" && req.url.includes("/letter")) {
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
      const { application_id, letter_type } = body;

      if (!application_id || !letter_type) {
        return json({ error: "application_id and letter_type are required" }, 400);
      }

      const { data: letterId, error } = await supabase.rpc('generate_admission_letter', {
        p_application_id: application_id,
        p_letter_type: letter_type,
        p_generated_by: user.id
      });

      if (error) return json({ error: error.message }, 400);

      // Get the generated letter
      const { data: letter, error: letterErr } = await supabase
        .from("admission_letters")
        .select("*")
        .eq("id", letterId)
        .single();

      if (letterErr) return json({ error: letterErr.message }, 400);

      return json({
        data: {
          letter,
          message: "Admission letter generated successfully"
        }
      });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get admissions statistics (staff/admin only)
  if (req.method === "GET" && req.url.includes("/stats")) {
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
      const dateFrom = url.searchParams.get("from");
      const dateTo = url.searchParams.get("to");

      const { data: stats, error } = await supabase.rpc('get_admissions_stats', {
        p_date_from: dateFrom,
        p_date_to: dateTo
      });

      if (error) return json({ error: error.message }, 400);

      return json({ data: stats });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get applications by trade (staff/admin only)
  if (req.method === "GET" && req.url.includes("/by-trade")) {
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

      const { data: applications, error } = await supabase.rpc('get_applications_by_trade');

      if (error) return json({ error: error.message }, 400);

      return json({ data: applications });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  // Get user's own applications
  if (req.method === "GET" && req.url.includes("/my-applications")) {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) return json({ error: "Invalid token" }, 401);

      const { data: applications, error } = await supabase
        .from("admissions_applications")
        .select("*")
        .eq("applicant_email", user.email)
        .order("submitted_at", { ascending: false });

      if (error) return json({ error: error.message }, 400);

      return json({ data: applications });
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }

  return json({ error: "Method not allowed" }, 405);
});
