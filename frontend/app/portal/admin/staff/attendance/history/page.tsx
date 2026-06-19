'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function AttendanceHistoryPage() {
  return (
    <PortalSectionShell
      title="Attendance History"
      description="View and search historical attendance records"
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
            <CardTitle>Filter Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Staff Member</label>
                <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option>All Staff</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Search</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Staff Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check In</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: '2024-03-06',
                      name: 'John Doe',
                      checkIn: '08:15 AM',
                      checkOut: '05:30 PM',
                      duration: '9h 15m',
                      status: 'Present',
                    },
                    {
                      date: '2024-03-06',
                      name: 'Jane Smith',
                      checkIn: '08:02 AM',
                      checkOut: '05:00 PM',
                      duration: '8h 58m',
                      status: 'Present',
                    },
                    {
                      date: '2024-03-05',
                      name: 'Mike Johnson',
                      checkIn: '08:45 AM',
                      checkOut: '05:15 PM',
                      duration: '8h 30m',
                      status: 'Late',
                    },
                  ].map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-600">{record.date}</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">{record.name}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkIn}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkOut}</td>
                      <td className="py-3 px-4 text-slate-600">{record.duration}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
