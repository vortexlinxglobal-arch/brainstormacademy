import { useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(`Signup failed: ${error.message}`);
      return;
    }

    // If email confirmation is enabled in Supabase Auth settings, user must confirm via email.
    // If disabled, data.session will be present and you can use it immediately.
    if (data.user && !data.session) {
      setMessage(
        "Signup successful. Please check your email to confirm your account."
      );
    } else {
      setMessage("Signup successful. You are signed in.");
      // Optional: store session or redirect
      // localStorage.setItem('sb_session', JSON.stringify(data.session));
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create account</h2>
      <form onSubmit={handleSignup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
