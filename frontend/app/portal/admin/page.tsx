'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'

export default function PortalAdminPage() {
  return (
    <PortalSectionShell
      title="Admin workspace"
      description="Administrator portal for Brainstorm Academy"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Programs</h2>
          <p className="mt-3 text-sm text-slate-600">Create, update, and review academy programs and trade offerings.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Students</h2>
          <p className="mt-3 text-sm text-slate-600">Review enrollments, manage student profiles, and oversee onboarding.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Reports</h2>
          <p className="mt-3 text-sm text-slate-600">Monitor performance metrics, admissions progress, and business center activity.</p>
        </div>
      </div>
    </PortalSectionShell>
  )
}
