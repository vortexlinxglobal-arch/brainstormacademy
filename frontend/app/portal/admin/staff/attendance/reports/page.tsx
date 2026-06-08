'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Download, Filter } from 'lucide-react'

export default function AttendanceReportsPage() {
  return (
    <PortalSectionShell
      title="Attendance Reports"
      description="Export and analyze staff attendance data"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        <Link href="/portal/admin/staff/attendance">
          <Button variant="outline" className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Daily Attendance</h3>
                  <div className="space-y-3 mb-4">
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Monthly Report</h3>
                  <div className="space-y-3 mb-4">
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <option>January 2024</option>
                      <option>February 2024</option>
                      <option>March 2024</option>
                    </select>
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Staff Summary</h3>
                  <div className="space-y-3 mb-4">
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <option>All Staff</option>
                      <option>Instructors</option>
                      <option>Administrators</option>
                    </select>
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export as Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pre-made Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { name: 'Absenteeism Report', desc: 'Staff members with high absence rates' },
                { name: 'Late Arrival Report', desc: 'Frequency of late check-ins' },
                { name: 'Overtime Report', desc: 'Staff working beyond standard hours' },
                { name: 'Department Summary', desc: 'Attendance by department' },
                { name: 'Quarterly Trends', desc: 'Attendance patterns over time' },
                { name: 'Compliance Report', desc: 'Staff meeting attendance targets' },
              ].map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{report.name}</p>
                    <p className="text-sm text-slate-600">{report.desc}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
