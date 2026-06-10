'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Loader,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { apiClient } from '@/src/api'

interface DashboardMetrics {
  activePrograms: number
  totalStudents: number
  totalStaff: number
  activeEnrollments: number
  completedCourses: number
  averageRating: number
  pendingAdmissions: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export default function AdminDashboardMetrics() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true)
      try {
        const [admissionsStats, adminStudents, adminPrograms] = await Promise.all([
          apiClient.getAdmissionsStats(),
          apiClient.getAdminStudents(),
          apiClient.getAdminPrograms(),
        ])

        setMetrics({
          activePrograms: adminPrograms?.programs?.length || 0,
          totalStudents: adminStudents?.students?.length || 0,
          totalStaff: 24, // placeholder
          activeEnrollments: adminStudents?.students?.filter((s: any) => s.enrollment_status === 'active')?.length || 0,
          completedCourses: adminPrograms?.programs?.filter((p: any) => p.completion_rate > 80)?.length || 0,
          averageRating: 4.6,
          pendingAdmissions: admissionsStats?.pending || 0,
          recentActivity: [
            { id: '1', type: 'enrollment', message: '5 new students enrolled this week', timestamp: '2 hours ago' },
            { id: '2', type: 'program', message: 'Advanced Nursing program updated', timestamp: '1 day ago' },
            { id: '3', type: 'staff', message: '2 new instructors onboarded', timestamp: '2 days ago' },
          ],
        })
      } catch (err) {
        console.error('Failed to load metrics:', err)
        setError('Unable to load dashboard metrics')
        // Set placeholder data on error
        setMetrics({
          activePrograms: 42,
          totalStudents: 128,
          totalStaff: 24,
          activeEnrollments: 95,
          completedCourses: 12,
          averageRating: 4.6,
          pendingAdmissions: 8,
          recentActivity: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [])

  const statCards = [
    {
      title: 'Active Programs',
      value: metrics?.activePrograms || 0,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      href: '/portal/admin/programs',
    },
    {
      title: 'Total Students',
      value: metrics?.totalStudents || 0,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/portal/admin/students',
    },
    {
      title: 'Staff Members',
      value: metrics?.totalStaff || 0,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      href: '/portal/admin/staff',
    },
    {
      title: 'Active Enrollments',
      value: metrics?.activeEnrollments || 0,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      href: '/portal/admin/enrollments',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-700">Loading dashboard metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-3xl bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-700">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Operations Overview</h1>
              <p className="mt-4 text-sm leading-7 text-slate-700 max-w-2xl">
                Monitor key metrics, manage programs and staff, and track student progress across the academy.
              </p>
            </div>
            <Link href="/portal/admin/settings">
              <Button variant="outline" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </section>

        {error && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.href} href={card.href}>
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">{card.title}</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
                      </div>
                      <div className={`rounded-2xl p-4 ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link href="/portal/admin/students/new">
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Enroll Student</p>
                        <p className="text-xs text-slate-700">Register new learner</p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/portal/admin/programs/new">
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Create Program</p>
                        <p className="text-xs text-slate-700">Add new trade/course</p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/portal/admin/staff/new">
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Add Staff</p>
                        <p className="text-xs text-slate-700">Onboard instructor/admin</p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/portal/admin/admissions">
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Review Admissions</p>
                        <p className="text-xs text-slate-700">{metrics?.pendingAdmissions} pending</p>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.recentActivity.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-slate-200 p-3">
                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-700 mt-1">{activity.timestamp}</p>
                  </div>
                ))}
                {(!metrics?.recentActivity || metrics.recentActivity.length === 0) && (
                  <p className="text-sm text-slate-700">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Link href="/portal/admin/students">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <Users className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Student Management</h3>
                <p className="mt-2 text-sm text-slate-700">Manage enrollments, profiles, and academic progress</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portal/admin/staff">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <Users className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Staff Management</h3>
                <p className="mt-2 text-sm text-slate-700">Attendance, ID cards, performance, and payroll</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portal/admin/programs">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <BookOpen className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Program Management</h3>
                <p className="mt-2 text-sm text-slate-700">Manage trades, courses, and curricula</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portal/admin/analytics">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <BarChart3 className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Analytics & Reports</h3>
                <p className="mt-2 text-sm text-slate-700">View statistics, trends, and performance insights</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portal/admin/inventory">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <Users className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Inventory & Resources</h3>
                <p className="mt-2 text-sm text-slate-700">Track equipment, materials, and facilities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portal/admin/meetings">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="pt-8">
                <Users className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Meetings & Records</h3>
                <p className="mt-2 text-sm text-slate-700">Management and standardization meetings</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
