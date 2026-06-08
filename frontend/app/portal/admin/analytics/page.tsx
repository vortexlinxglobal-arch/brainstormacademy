'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminAnalyticsPage() {
  return (
    <PortalSectionShell
      title="Analytics & Reports"
      description="View academy statistics, trends, and performance insights"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 font-medium">Monthly Active Users</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">287</p>
                <p className="mt-2 text-xs text-green-600">↑ 12% vs last month</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 font-medium">Completion Rate</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">72%</p>
                <p className="mt-2 text-xs text-green-600">↑ 5% vs last quarter</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 font-medium">Student Satisfaction</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">4.6/5</p>
                <p className="mt-2 text-xs text-slate-500">Based on 200+ reviews</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 font-medium">Avg. Course Duration</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">6.2 wks</p>
                <p className="mt-2 text-xs text-slate-500">Target: 6 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/portal/admin/analytics/enrollment">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Enrollment Trends</h3>
                  <p className="mt-2 text-sm text-slate-600">Student sign-ups and program popularity</p>
                </div>
              </Link>
              <Link href="/portal/admin/analytics/performance">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Performance Metrics</h3>
                  <p className="mt-2 text-sm text-slate-600">Student grades and completion stats</p>
                </div>
              </Link>
              <Link href="/portal/admin/analytics/staff">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Staff Analytics</h3>
                  <p className="mt-2 text-sm text-slate-600">Attendance, workload, and performance</p>
                </div>
              </Link>
              <Link href="/portal/admin/analytics/revenue">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Revenue Reports</h3>
                  <p className="mt-2 text-sm text-slate-600">Tuition, receipts, and financial summary</p>
                </div>
              </Link>
              <Link href="/portal/admin/analytics/usage">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Platform Usage</h3>
                  <p className="mt-2 text-sm text-slate-600">System activity and user engagement</p>
                </div>
              </Link>
              <Link href="/portal/admin/analytics/exports">
                <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
                  <h3 className="font-semibold text-slate-900">Export Reports</h3>
                  <p className="mt-2 text-sm text-slate-600">Download as PDF or CSV</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
