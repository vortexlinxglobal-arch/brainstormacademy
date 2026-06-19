'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminStaffManagementPage() {
  return (
    <PortalSectionShell
      title="Staff Management"
      description="Manage instructors, administrators, and support staff"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Staff</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">24</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active This Week</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">23</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Avg. Performance</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">4.5/5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Staff Functions</CardTitle>
              <Link href="/portal/admin/staff/new">
                <Button>Add Staff</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/portal/admin/staff/attendance">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Attendance Tracking</h3>
                  <p className="mt-2 text-sm text-slate-600">Mark attendance, view records</p>
                </div>
              </Link>
              <Link href="/portal/admin/staff/id-cards">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">ID Card Generation</h3>
                  <p className="mt-2 text-sm text-slate-600">Auto-generate and manage ID cards</p>
                </div>
              </Link>
              <Link href="/portal/admin/staff/performance">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Performance Reviews</h3>
                  <p className="mt-2 text-sm text-slate-600">Track ratings and feedback</p>
                </div>
              </Link>
              <Link href="/portal/admin/staff/salary">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Salary Management</h3>
                  <p className="mt-2 text-sm text-slate-600">Payroll, deductions, history</p>
                </div>
              </Link>
              <Link href="/portal/admin/staff/directory">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Staff Directory</h3>
                  <p className="mt-2 text-sm text-slate-600">View all staff profiles</p>
                </div>
              </Link>
              <Link href="/portal/admin/staff/departments">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Departments</h3>
                  <p className="mt-2 text-sm text-slate-600">Manage departments and roles</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
