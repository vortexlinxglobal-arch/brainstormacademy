'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'

export default function PortalInstructorPage() {
  return (
    <PortalSectionShell
      title="Instructor workspace"
      description="Instructor portal for Brainstorm Academy"
      allowedRoles={['Instructor']}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Courses</h2>
          <p className="mt-3 text-sm text-slate-600">Manage your courses, content, and student progress each term.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Students</h2>
          <p className="mt-3 text-sm text-slate-600">See enrolled learners, messages, and recent activity at a glance.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Scheduling</h2>
          <p className="mt-3 text-sm text-slate-600">Plan classes, assignments, and progress checkpoints.</p>
        </div>
      </div>
    </PortalSectionShell>
  )
}
