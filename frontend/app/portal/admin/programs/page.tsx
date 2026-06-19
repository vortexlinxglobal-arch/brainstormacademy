'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminProgramsManagementPage() {
  return (
    <PortalSectionShell
      title="Program Management"
      description="Create and manage trades, courses, and curricula"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Programs</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">42</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Trade Categories</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">8</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Courses</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">156</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Avg. Enrollment</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">3.2</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Program Operations</CardTitle>
              <Link href="/portal/admin/programs/new">
                <Button>Create Program</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/portal/admin/programs/list">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Programs</h3>
                  <p className="mt-2 text-sm text-slate-600">View all programs and trades</p>
                </div>
              </Link>
              <Link href="/portal/admin/programs/trades">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Trades</h3>
                  <p className="mt-2 text-sm text-slate-600">Manage skill tracks</p>
                </div>
              </Link>
              <Link href="/portal/admin/programs/courses">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Courses</h3>
                  <p className="mt-2 text-sm text-slate-600">Manage course content</p>
                </div>
              </Link>
              <Link href="/portal/admin/programs/curriculum">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Curriculum</h3>
                  <p className="mt-2 text-sm text-slate-600">Design course structure</p>
                </div>
              </Link>
              <Link href="/portal/admin/programs/categories">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Categories</h3>
                  <p className="mt-2 text-sm text-slate-600">Manage program categories</p>
                </div>
              </Link>
              <Link href="/portal/admin/programs/enrollment">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Enrollment Rules</h3>
                  <p className="mt-2 text-sm text-slate-600">Set prerequisites and limits</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
