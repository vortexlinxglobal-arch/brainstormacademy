'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminStudentsManagementPage() {
  return (
    <PortalSectionShell
      title="Student Management"
      description="Manage student enrollments, profiles, and academic progress"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Students</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">128</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Enrollment</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">95</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Completed</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">21</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Avg. Progress</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">68%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Operations</CardTitle>
              <Link href="/portal/admin/students/new">
                <Button>Enroll Student</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/portal/admin/students/list">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Student List</h3>
                  <p className="mt-2 text-sm text-slate-600">View and manage all students</p>
                </div>
              </Link>
              <Link href="/portal/admin/students/enrollments">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Enrollments</h3>
                  <p className="mt-2 text-sm text-slate-600">Manage course assignments</p>
                </div>
              </Link>
              <Link href="/portal/admin/students/progress">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Progress Tracking</h3>
                  <p className="mt-2 text-sm text-slate-600">Monitor course completion</p>
                </div>
              </Link>
              <Link href="/portal/admin/students/certificates">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Certificates</h3>
                  <p className="mt-2 text-sm text-slate-600">Issue and manage credentials</p>
                </div>
              </Link>
              <Link href="/portal/admin/students/admissions">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Admissions</h3>
                  <p className="mt-2 text-sm text-slate-600">Review applications</p>
                </div>
              </Link>
              <Link href="/portal/admin/students/feedback">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Feedback & Reports</h3>
                  <p className="mt-2 text-sm text-slate-600">Student surveys and reports</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
