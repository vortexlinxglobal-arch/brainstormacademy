'use client'

import { useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Upload, Printer } from 'lucide-react'

export default function IDCardGeneratorPage() {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)

  const staffList = [
    { id: '1', name: 'John Doe', role: 'Instructor', department: 'IT Training' },
    { id: '2', name: 'Jane Smith', role: 'Administrator', department: 'Admin' },
    { id: '3', name: 'Mike Johnson', role: 'Support Staff', department: 'Operations' },
    { id: '4', name: 'Sarah Williams', role: 'Instructor', department: 'Nursing Science' },
  ]

  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    )
  }

  const handleGenerate = async () => {
    setGenerating(true)
    // Simulate ID card generation
    setTimeout(() => {
      setGenerating(false)
      alert(`Generated ID cards for ${selectedStaff.length} staff member(s)`)
    }, 1500)
  }

  return (
    <PortalSectionShell
      title="ID Card Generator"
      description="Auto-generate and manage staff identification cards"
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
            <CardTitle>Select Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {staffList.map((staff) => (
                <label key={staff.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={() => toggleStaffSelection(staff.id)}
                    className="rounded-lg w-5 h-5 text-emerald-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{staff.name}</p>
                    <p className="text-sm text-slate-600">{staff.role} • {staff.department}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={selectedStaff.length === 0 || generating}
                className="flex-1"
              >
                {generating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Generate IDs ({selectedStaff.length})
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={selectedStaff.length === 0}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ID Card Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto rounded-2xl border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-6 aspect-[4/6] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brainstorm Academy</p>
                <p className="text-xs text-slate-600 mt-1">Staff ID</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-24 rounded-lg bg-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-900 text-sm">John Doe</p>
                <p className="text-xs text-slate-600">Instructor</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><span className="font-semibold">ID:</span> BSA-2024-001</p>
                <p><span className="font-semibold">Dept:</span> IT Training</p>
                <p><span className="font-semibold">Valid:</span> 2024-2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
