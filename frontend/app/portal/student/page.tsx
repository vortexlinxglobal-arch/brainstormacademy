'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'

export default function PortalStudentPage() {
  return (
    <PortalSectionShell
      title="Student workspace"
      description="Student portal for Brainstorm Academy"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Learning Plan</h2>
          <p className="mt-3 text-sm text-slate-600">Track your active courses, assignments, and progress.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Certificates</h2>
          <p className="mt-3 text-sm text-slate-600">View credentials and completion pathways for your program.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Resources</h2>
          <p className="mt-3 text-sm text-slate-600">Access course materials, support resources, and help links.</p>
        </div>
      </div>
    </PortalSectionShell>
  )
}
