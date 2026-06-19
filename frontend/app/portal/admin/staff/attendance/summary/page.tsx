'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AttendanceSummaryPage() {
  return (
    <PortalSectionShell
      title="Attendance Summary"
      description="Monthly overview and trends"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <Link href="/portal/admin/staff/attendance">
          <Button variant="outline" className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </Link>

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
                <p className="text-sm text-slate-600 font-medium">Avg. Attendance Rate</p>
                <p className="mt-3 text-4xl font-bold text-emerald-600">94%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Work Hours</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">4,672</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'January', present: 92, absent: 6, late: 2 },
                { month: 'February', present: 94, absent: 4, late: 2 },
                { month: 'March', present: 95, absent: 3, late: 2 },
              ].map((month, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-900">{month.month}</span>
                    <span className="text-sm text-slate-600">{month.present}% present</span>
                  </div>
                  <div className="flex h-2 gap-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${month.present}%` }}
                    />
                    <div className="bg-red-500" style={{ width: `${month.absent}%` }} />
                    <div className="bg-amber-500" style={{ width: `${month.late}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Jane Smith', rate: '100%' },
                { name: 'John Doe', rate: '99%' },
                { name: 'Sarah Williams', rate: '98%' },
              ].map((staff, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
                  <span className="font-semibold text-slate-900">{staff.name}</span>
                  <span className="text-emerald-700 font-bold">{staff.rate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
