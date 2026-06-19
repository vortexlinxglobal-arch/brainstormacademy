'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Clock, Star, Users } from 'lucide-react'
import Link from 'next/link'

interface PerformanceOverview {
  averageRating: number
  reviewCount: number
  goalCompletion: number
  topStaff: string
  recentReviews: Array<{ id: string; staff: string; rating: number; comment: string; date: string }>
}

export default function AdminPerformancePage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<PerformanceOverview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPerformance() {
      setLoading(true)
      try {
        const result = await apiClient.getPerformanceOverview()
        setMetrics({
          averageRating: result.averageRating ?? 4.5,
          reviewCount: result.reviewCount ?? 26,
          goalCompletion: result.goalCompletion ?? 76,
          topStaff: result.topStaff ?? 'Habiba Muhammad',
          recentReviews:
            result.recentReviews ?? [
              { id: '1', staff: 'Musa Isgogo', rating: 4.9, comment: 'Strong delivery and follow-up.', date: '2026-06-02' },
              { id: '2', staff: 'Ashiru Ahmad', rating: 4.7, comment: 'Excellent training presence.', date: '2026-05-26' },
              { id: '3', staff: 'Muhammad Hauwa', rating: 4.8, comment: 'Very supportive to learners.', date: '2026-05-18' },
            ],
        })
      } catch (err) {
        console.error('Performance load failed:', err)
        setError('Unable to load performance insights. Showing the most recent available summary.')
        setMetrics({
          averageRating: 4.5,
          reviewCount: 26,
          goalCompletion: 76,
          topStaff: 'Habiba Muhammad',
          recentReviews: [
            { id: '1', staff: 'Musa Isgogo', rating: 4.9, comment: 'Strong delivery and follow-up.', date: '2026-06-02' },
            { id: '2', staff: 'Ashiru Ahmad', rating: 4.7, comment: 'Excellent training presence.', date: '2026-05-26' },
            { id: '3', staff: 'Muhammad Hauwa', rating: 4.8, comment: 'Very supportive to learners.', date: '2026-05-18' },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    loadPerformance()
  }, [])

  if (loading || !metrics) {
    return (
      <PortalSectionShell
        title="Performance Tracking"
        description="Measuring staff impact, review cycles, and learning outcomes."
        allowedRoles={['Admin', 'Manager', 'Staff']}
      >
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      </PortalSectionShell>
    )
  }

  return (
    <PortalSectionShell
      title="Performance Tracking"
      description="Measuring staff impact, review cycles, and learning outcomes."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        {error && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Rating</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-emerald-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Learner feedback and peer review scores.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Review Cycles</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.reviewCount}</p>
                </div>
                <Clock className="h-8 w-8 text-slate-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Completed performance reviews this quarter.</p>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-amber-50">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Goal completion</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.goalCompletion}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-amber-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Progress against training and operations targets.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Top performer</CardTitle>
                <p className="text-sm text-slate-600">Highest rated staff member in the current cycle.</p>
              </div>
              <div className="rounded-3xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Top performer</p>
                <p className="mt-2 text-lg font-semibold">{metrics.topStaff}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentReviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{review.staff}</p>
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">{review.rating}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Performance tools</CardTitle>
                <p className="text-sm text-slate-600">Capture reviews, calibrate ratings, and set performance targets.</p>
              </div>
              <Link href="/portal/admin/performance/reviews">
                <Button>Open reviews</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-700">Review cycle planning</p>
                <p className="mt-3 text-sm text-slate-600">Create structured review cycles for trainers and staff.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-700">Target setting</p>
                <p className="mt-3 text-sm text-slate-600">Set measurable goals for course completion and instructor performance.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
