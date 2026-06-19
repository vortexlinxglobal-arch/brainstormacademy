'use client'

import { useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Star, ClipboardList } from 'lucide-react'

const reviews = [
  {
    id: 'rev-1',
    staff: 'Musa Isgogo',
    role: 'Center Manager',
    rating: 4.9,
    status: 'Completed',
    comment: 'Outstanding delivery and mentorship.',
    date: '2026-06-02',
  },
  {
    id: 'rev-2',
    staff: 'Habiba Muhammad',
    role: 'QAA Staff',
    rating: 4.8,
    status: 'Completed',
    comment: 'Strong learner support and engagement.',
    date: '2026-05-18',
  },
  {
    id: 'rev-3',
    staff: 'Ashiru Ahmad Rufai',
    role: 'Facilitator',
    rating: 4.7,
    status: 'Pending',
    comment: 'Needs final review confirmation.',
    date: '2026-06-05',
  },
]

export default function AdminPerformanceReviewsPage() {
  const [search, setSearch] = useState('')

  const filtered = reviews.filter((review) =>
    [review.staff, review.role, review.status, review.comment].some((value) =>
      value.toLowerCase().includes(search.toLowerCase()),
    ),
  )

  return (
    <PortalSectionShell
      title="Performance Reviews"
      description="Review staff appraisal records and approve new feedback cycles."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Review dashboard</CardTitle>
                <p className="text-sm text-slate-600">Assess completed and pending review cycles for staff performance.</p>
              </div>
              <Button variant="outline">Create review</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search staff, status, or comment"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Export reviews</Button>
                <Button variant="outline">View ratings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent>
              <p className="text-sm font-medium text-slate-600">Completed reviews</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">2</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Star className="h-4 w-4 text-emerald-600" />
                Average rating 4.85
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-white">
            <CardContent>
              <p className="text-sm font-medium text-slate-600">Pending reviews</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">1</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <ClipboardList className="h-4 w-4 text-slate-700" />
                Review cycle in progress
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-amber-50">
            <CardContent>
              <p className="text-sm font-medium text-slate-600">Next review due</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">2026-06-25</p>
              <div className="mt-3 text-sm text-slate-600">Calendar reminder for the next appraisal round.</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent review records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Staff</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Rating</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filtered.map((review) => (
                    <tr key={review.id}>
                      <td className="px-4 py-4 text-slate-900">{review.staff}</td>
                      <td className="px-4 py-4 text-slate-700">{review.role}</td>
                      <td className="px-4 py-4 text-slate-700">{review.rating}</td>
                      <td className="px-4 py-4 text-slate-700">{review.status}</td>
                      <td className="px-4 py-4 text-slate-700">{review.date}</td>
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
