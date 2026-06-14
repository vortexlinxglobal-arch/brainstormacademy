'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { CheckCircle, Loader, Play } from 'lucide-react'
import { auth, apiClient, db } from '@/src/api'

interface StudentMetrics {
  enrolledCourses: number
  completedCourses: number
  certificatesEarned: number
  averageProgress: number
}

const quickLinks = [
  { label: 'Dashboard', href: '/portal/student/dashboard' },
  { label: 'My Courses', href: '/portal/student/courses' },
  { label: 'Browse Skills', href: '/portal/student/browse' },
  { label: 'Progress', href: '/portal/student/progress' },
  { label: 'Certificates', href: '/portal/student/certificates' },
]

const masteryCards = [
  { value: 82, title: 'Assignments', color: '#1d4ed8' },
  { value: 74, title: 'Projects', color: '#047857' },
  { value: 68, title: 'Practical Labs', color: '#0f766e' },
]

const upcomingLessons = [
  { title: 'Website prototyping', time: 'Today · 09:00 AM', detail: 'Design review and live testing' },
  { title: 'Client presentation prep', time: 'Tomorrow · 11:00 AM', detail: 'Pitch deck and feedback' },
  { title: 'Final project demo', time: 'Friday · 02:00 PM', detail: 'Capstone showcase' },
]

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null)
  const [userName, setUserName] = useState('Student')

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

        const profileResult = await db.getProfile(user.id)
        if (profileResult.data) {
          setUserName(profileResult.data.first_name || 'Student')
        }

        const dashboardResult = await apiClient.getStudentDashboard()
        if (dashboardResult) {
          setMetrics({
            enrolledCourses: dashboardResult.enrollments?.length || 0,
            completedCourses: dashboardResult.completed_courses || 0,
            certificatesEarned: dashboardResult.certificates?.length || 0,
            averageProgress: dashboardResult.average_progress || 0,
          })
        } else {
          setMetrics({
            enrolledCourses: 0,
            completedCourses: 0,
            certificatesEarned: 0,
            averageProgress: 0,
          })
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err)
        setMetrics({
          enrolledCourses: 3,
          completedCourses: 1,
          certificatesEarned: 1,
          averageProgress: 65,
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-700">Loading your learning dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell
      title="Student Portal"
      description="Your personalized learning workspace"
      allowedRoles={['Student']}
      userName={userName}
      navLinks={quickLinks}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <CardContent className="p-0">
                <p className="text-sm text-slate-600">Enrolled Courses</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics?.enrolledCourses || 0}</p>
                <p className="mt-3 text-sm text-slate-600">Active learning paths you are currently enrolled in.</p>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <CardContent className="p-0">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="mt-4 text-3xl font-semibold text-blue-600">{metrics?.completedCourses || 0}</p>
                <p className="mt-3 text-sm text-slate-600">Courses and modules you have finished.</p>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <CardContent className="p-0">
                <p className="text-sm text-slate-600">Certificates</p>
                <p className="mt-4 text-3xl font-semibold text-purple-600">{metrics?.certificatesEarned || 0}</p>
                <p className="mt-3 text-sm text-slate-600">Recognitions you have earned so far.</p>
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl">Current progress</CardTitle>
              <CardDescription>Review your latest progress, mastery levels, and next actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {masteryCards.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm">
                  <div
                    className="relative mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-white"
                    style={{
                      background: `conic-gradient(${item.color} ${item.value * 3.6}deg, rgba(226,232,240,0.95) 0deg)`,
                    }}
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                      <p className="text-xl font-semibold text-slate-900">{item.value}%</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        <section className="space-y-6">
          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl">Upcoming lessons</CardTitle>
              <CardDescription>Prepare for your next practical sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{lesson.detail}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {lesson.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl">Quick actions</CardTitle>
              <CardDescription>Pick the most important task for today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="brand" size="lg" className="w-full justify-between">
                Resume last lesson
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="lg" className="w-full justify-between">
                Submit assignment
                <CheckCircle className="h-4 w-4" />
              </Button>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tip</p>
                <p className="mt-3 text-sm text-slate-700">
                  Complete your next lesson before the live class to stay ahead in your certification path.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-2xl">Recommended skills</CardTitle>
          <CardDescription>Skills aligned with your current training goals.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Responsive UI design', label: 'Web development', badge: 'High impact' },
            { title: 'Portfolio optimization', label: 'Career readiness', badge: 'Recommended' },
            { title: 'Client communication', label: 'Soft skills', badge: 'Important' },
            { title: 'Entrepreneurship basics', label: 'Business', badge: 'Growth track' },
          ].map((skill) => (
            <div key={skill.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{skill.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{skill.label}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  {skill.badge}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
