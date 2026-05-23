'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface ReportItem {
  id: number
  title: string
  summary: string
  updated: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setReports([
      { id: 1, title: 'Branch Performance', summary: 'Overview of branch revenue and utilization.', updated: '2 hours ago' },
      { id: 2, title: 'Service Growth', summary: 'Monthly uptake and service review.', updated: 'Yesterday' },
      { id: 3, title: 'Enrollment Trends', summary: 'Learner pipeline and business engagement.', updated: '3 days ago' },
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
          <p className="text-sm text-slate-600">Generate and review business center performance insights.</p>
        </div>
        <Button variant="secondary">Schedule Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Reports Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{reports.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{reports[0]?.updated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{report.summary}</p>
              <div className="mt-4 flex justify-end">
                <Button size="sm">View Report</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
