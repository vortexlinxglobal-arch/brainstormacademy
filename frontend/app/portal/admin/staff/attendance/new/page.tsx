'use client'

import { useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

export default function MarkAttendancePage() {
  const [attendanceType, setAttendanceType] = useState<'checkin' | 'checkout'>('checkin')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const staffList = [
    { id: '1', name: 'John Doe', department: 'IT Training' },
    { id: '2', name: 'Jane Smith', department: 'Admin' },
    { id: '3', name: 'Mike Johnson', department: 'Operations' },
    { id: '4', name: 'Sarah Williams', department: 'Nursing Science' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <PortalSectionShell
      title="Mark Attendance"
      description="Record staff check-in or check-out"
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
            <CardTitle>Mark Staff Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
              {/* Attendance Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Attendance Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="checkin"
                      checked={attendanceType === 'checkin'}
                      onChange={() => setAttendanceType('checkin')}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">Check In</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="checkout"
                      checked={attendanceType === 'checkout'}
                      onChange={() => setAttendanceType('checkout')}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">Check Out</span>
                  </label>
                </div>
              </div>

              {/* Staff Selection */}
              <div>
                <label htmlFor="staff" className="block text-sm font-medium text-slate-700 mb-2">
                  Select Staff Member
                </label>
                <select
                  id="staff"
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">-- Choose a staff member --</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} • {staff.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  placeholder="e.g., Remote work, Medical appointment, etc."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              {submitted && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-sm text-emerald-800">✓ Attendance recorded successfully</p>
                </div>
              )}

              <Button type="submit" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                {attendanceType === 'checkin' ? 'Check In' : 'Check Out'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
