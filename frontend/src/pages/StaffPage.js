import { supabase } from "../api/supabaseClient";

export default function StaffPage() {
  async function createStaff() {
    // Replace with the account you signed up with
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "staff1@example.com",
      password: "StrongPassword123",
    });
    if (error) {
      console.error(error.message);
      return;
    }

    const token = data.session.access_token;

    const res = await fetch(
      "https://elesdexlehfmwfrbbrgd.functions.supabase.co/staff",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: data.user.id,
          staff_category: "STAFF",
          department_code: "ICT",
          bio: { note: "created via StaffPage" },
          employment_date: "2025-12-05",
          specialty: "Networking",
        }),
      }
    );

    const result = await res.json();
    console.log(result);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Staff Portal</h2>
      <button onClick={createStaff}>Create Staff</button>
    </div>
  );
}
