'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import {
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  staffName: string
  role: string
  checkIn: string
  checkOut?: string
  duration?: string
  status: 'present' | 'absent' | 'late' | 'early-checkout'
}

export default function StaffAttendancePage() {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    // Simulate loading attendance records
    setTimeout(() => {
      setRecords([
        {
          id: '1',
          staffName: 'John Doe',
          role: 'Instructor',
          checkIn: '08:15 AM',
          checkOut: '05:30 PM',
          duration: '9h 15m',
          status: 'present',
        },
        {
          id: '2',
          staffName: 'Jane Smith',
          role: 'Administrator',
          checkIn: '08:02 AM',
          checkOut: '05:00 PM',
          duration: '8h 58m',
          status: 'present',
        },
        {
          id: '3',
          staffName: 'Mike Johnson',
          role: 'Support Staff',
          checkIn: '08:45 AM',
          checkOut: undefined,
          duration: undefined,
          status: 'late',
        },
        {
          id: '4',
          staffName: 'Sarah Williams',
          role: 'Instructor',
          checkIn: undefined,
          checkOut: undefined,
          duration: undefined,
          status: 'absent',
        },
      ])
      setLoading(false)
    }, 500)
  }, [selectedDate])

  const stats = {
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    late: records.filter((r) => r.status === 'late').length,
    total: records.length,
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      present: 'bg-emerald-100 text-emerald-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-amber-100 text-amber-700',
      'early-checkout': 'bg-orange-100 text-orange-700',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'present') return <CheckCircle className="h-4 w-4" />
    if (status === 'absent') return <AlertCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading attendance records...</p>
        </div>
      </div>
    )
  }

  return (
    <PortalSectionShell
      title="Staff Attendance"
      description="Track daily staff check-in, check-out, and attendance records"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="grid gap-6">
        {/* Stats */}
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Present Today</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.present}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Absent</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Late</p>
                  <p className="mt-2 text-3xl font-bold text-amber-600">{stats.late}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Attendance Rate</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {Math.round(((stats.present + stats.late) / stats.total) * 100)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-slate-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <Link href="/portal/admin/staff/attendance/new">
                  <Button>Mark Attendance</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check In</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-900 font-medium">{record.staffName}</td>
                      <td className="py-3 px-4 text-slate-600">{record.role}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkIn || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkOut || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">{record.duration || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/portal/admin/staff/attendance/history">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <Calendar className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">Attendance History</h3>
              <p className="mt-1 text-xs text-slate-600">View monthly records</p>
            </div>
          </Link>
          <Link href="/portal/admin/staff/attendance/id-cards">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <User className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">ID Card Generator</h3>
              <p className="mt-1 text-xs text-slate-600">Auto-generate IDs</p>
            </div>
          </Link>
          <Link href="/portal/admin/staff/attendance/reports">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <Download className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">Export Reports</h3>
              <p className="mt-1 text-xs text-slate-600">Download as CSV/PDF</p>
            </div>
          </Link>
          <Link href="/portal/admin/staff/attendance/summary">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <TrendingUp className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">Summary Report</h3>
              <p className="mt-1 text-xs text-slate-600">Monthly overview</p>
            </div>
          </Link>
        </div>
      </div>
    </PortalSectionShell>
  )
}
