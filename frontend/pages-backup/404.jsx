import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "72px", marginBottom: "16px" }}>404</h1>
        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>Page not found</h2>
        <p style={{ color: "#4b5563", marginBottom: "24px" }}>
          The page you are looking for does not exist. Use the link below to go back home.
        </p>
        <Link href="/" style={{ display: "inline-flex", padding: "14px 28px", background: "#0f766e", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>
          Go back home
        </Link>
      </div>
    </main>
  );
}
