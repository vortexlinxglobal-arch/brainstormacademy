import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { Database } from "../../types.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

serve(async (req) => {
  const supabase = createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (req.method === "POST") {
    const body = await req.json();
    const {
      user_id,
      staff_category,
      department_code,
      bio,
      employment_date,
      specialty,
    } = body;

    // Resolve department
    let department_id: number | null = null;
    if (staff_category !== "IQAM") {
      const { data: dept, error: deptErr } = await supabase
        .from("departments")
        .select("id")
        .eq("code", department_code)
        .maybeSingle();
      if (deptErr || !dept)
        return json({ error: "Invalid department_code" }, 400);
      department_id = dept.id;
    }

    // Compute next seq per (category, department_id) by counting existing
    const { data: existing, error: countErr } = await supabase
      .from("staff_profiles")
      .select("seq", { count: "exact", head: true })
      .eq("staff_category", staff_category)
      .eq("department_id", department_id);

    const nextSeq =
      (existing?.length ?? 0) + ((countErr?.count as number) ?? 0) + 1;

    const { data, error } = await supabase
      .from("staff_profiles")
      .insert({
        user_id,
        staff_category,
        department_id,
        seq: nextSeq,
        bio,
        employment_date,
        specialty,
      })
      .select()
      .single();

    if (error) return json({ error: error.message }, 400);
    return json({ data });
  }

  return json({ error: "Method not allowed" }, 405);
});
