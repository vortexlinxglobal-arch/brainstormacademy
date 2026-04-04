import Link from "next/link";

export default function TermsPage() {
  return (
    <main style={{ padding: "4rem 1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Terms of Use</h1>
      <p>These terms describe how you may use the Brainstorm Skills website. This page will be updated with the full terms and conditions.</p>
      <p>
        Return to <Link href="/">Home</Link>.
      </p>
    </main>
  );
}
