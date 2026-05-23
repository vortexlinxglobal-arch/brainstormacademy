import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={{ padding: "4rem 1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p>Brainstorm Skills is committed to protecting your privacy. This page will be updated with the policy for data collection, cookies, and service usage.</p>
      <p>
        Return to <Link href="/">Home</Link>.
      </p>
    </main>
  );
}
