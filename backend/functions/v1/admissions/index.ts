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

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await req.json();
  const {
    student, // { first_name, last_name, dob, gender, contact, guardian }
    trade_code, // e.g., BTC
    template_id, // optional; if not provided, use default
  } = body;

  // Resolve trade
  const { data: trade } = await supabase
    .from("trades")
    .select("id, code, name")
    .eq("code", trade_code)
    .maybeSingle();
  if (!trade) return json({ error: "Invalid trade_code" }, 400);

  // Generate student reg and create student
  const { data: reg } = await supabase.rpc("gen_student_reg_number", {
    p_trade_id: trade.id,
  });
  const { data: studentRow, error: studentErr } = await supabase
    .from("students")
    .insert({
      registration_number: reg as string,
      ...student,
    })
    .select()
    .single();
  if (studentErr) return json({ error: studentErr.message }, 400);

  // Enrollment
  await supabase.from("enrollments").insert({
    student_id: studentRow.id,
    trade_id: trade.id,
    start_date: new Date().toISOString().slice(0, 10),
  });

  // Template
  let tplId = template_id;
  if (!tplId) {
    const { data: tpl } = await supabase
      .from("admission_templates")
      .select(
        "id, html_template, logo_path, watermark_path, signatory_name, signatory_title"
      )
      .eq("is_default", true)
      .maybeSingle();
    tplId = tpl?.id;
    if (!tplId)
      return json({ error: "No default admission template set" }, 400);
  }

  // Render HTML with placeholders
  const { data: tplRow } = await supabase
    .from("admission_templates")
    .select("*")
    .eq("id", tplId!)
    .single();
  const html = (tplRow?.html_template || "")
    .replaceAll(
      "{{student_name}}",
      `${studentRow.first_name} ${studentRow.last_name}`
    )
    .replaceAll("{{registration_number}}", studentRow.registration_number)
    .replaceAll("{{trade_name}}", trade.name)
    .replaceAll("{{issue_date}}", new Date().toLocaleDateString())
    .replaceAll(
      "{{signatory_block}}",
      `${tplRow.signatory_name}, ${tplRow.signatory_title}`
    );

  // Store HTML as file (PDF generation can be added later via headless render service)
  const fileName = `admission_${studentRow.id}.html`;
  const { error: uploadErr } = await supabase.storage
    .from("letters")
    .upload(fileName, new Blob([html], { type: "text/html" }), {
      upsert: true,
    });
  if (uploadErr) return json({ error: uploadErr.message }, 400);

  const { data: letter, error: letterErr } = await supabase
    .from("admission_letters")
    .insert({
      student_id: studentRow.id,
      template_id: tplId!,
      file_path: fileName,
      status: "issued",
    })
    .select()
    .single();
  if (letterErr) return json({ error: letterErr.message }, 400);

  return json({ data: { student: studentRow, letter } });
});
