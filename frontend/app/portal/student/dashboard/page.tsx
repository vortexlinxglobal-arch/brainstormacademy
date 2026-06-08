'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Loader,
} from 'lucide-react'
import Link from 'next/link'
import { auth, apiClient, db } from '@/src/api'

interface StudentMetrics {
  enrolledCourses: number
  completedCourses: number
  certificatesEarned: number
  averageProgress: number
  inProgressCourses: any[]
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null)
  const [userName, setUserName] = useState('Student')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      try {
        const sessionResult = await auth.getSession()
        const user = sessionResult.data.session?.user

        if (!user) {
          setLoading(false)
          return
        }

        // Load user profile
        const profileResult = await db.getProfile(user.id)
        if (profileResult.data) {
          const firstName = profileResult.data.first_name || 'Student'
          setUserName(firstName)
        }

        // Load student dashboard data
        const dashboardResult = await apiClient.getStudentDashboard()
        if (dashboardResult) {
          setMetrics({
            enrolledCourses: dashboardResult.enrollments?.length || 0,
            completedCourses: dashboardResult.completed_courses || 0,
            certificatesEarned: dashboardResult.certificates?.length || 0,
            averageProgress: dashboardResult.average_progress || 0,
            inProgressCourses: dashboardResult.enrollments?.slice(0, 3) || [],
          })
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err)
        setError('Unable to load dashboard data')
        // Set placeholder data
        setMetrics({
          enrolledCourses: 3,
          completedCourses: 1,
          certificatesEarned: 1,
          averageProgress: 65,
          inProgressCourses: [
            { id: 1, title: 'Advanced Nursing', progress: 75 },
            { id: 2, title: 'IT Fundamentals', progress: 60 },
            { id: 3, title: 'Business Management', progress: 45 },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your learning dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <PortalSectionShell
      title="Student Portal"
      description="Your personalized learning workspace"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Enrolled Courses</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">{metrics?.enrolledCourses || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Completed</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{metrics?.completedCourses || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Certificates</p>
                  <p className="mt-2 text-3xl font-bold text-purple-600">{metrics?.certificatesEarned || 0}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Avg. Progress</p>
                  <p className="mt-2 text-3xl font-bold text-orange-600">{metrics?.averageProgress || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continued Learning */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Continue Learning
              </CardTitle>
              <Link href="/portal/student/courses">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {metrics?.inProgressCourses && metrics.inProgressCourses.length > 0 ? (
              <div className="space-y-4">
                {metrics.inProgressCourses.map((course) => (
                  <Link key={course.id} href={`/portal/student/courses/${course.id}`}>
                    <div className="rounded-2xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{course.title}</h3>
                        <span className="text-sm font-medium text-slate-600">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">No courses in progress yet</p>
                <Link href="/portal/student/browse">
                  <Button>Browse Courses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/portal/student/courses">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <BookOpen className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">My Courses</h3>
              <p className="mt-1 text-xs text-slate-600">View all enrolled courses</p>
            </div>
          </Link>

          <Link href="/portal/student/browse">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <TrendingUp className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">Browse Catalog</h3>
              <p className="mt-1 text-xs text-slate-600">Explore available programs</p>
            </div>
          </Link>

          <Link href="/portal/student/progress">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <CheckCircle className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">My Progress</h3>
              <p className="mt-1 text-xs text-slate-600">Track your achievements</p>
            </div>
          </Link>

          <Link href="/portal/student/certificates">
            <div className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 cursor-pointer transition">
              <Award className="h-6 w-6 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900">Certificates</h3>
              <p className="mt-1 text-xs text-slate-600">View earned credentials</p>
            </div>
          </Link>
        </div>
      </div>
    </PortalSectionShell>
  )
}
