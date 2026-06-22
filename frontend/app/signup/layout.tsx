import React from "react";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8f4] text-slate-950">{children}</div>
  );
}
