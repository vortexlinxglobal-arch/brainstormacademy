'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InstructorDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [userFullName, setUserFullName] = useState<string>('Instructor')
  const [signedIn, setSignedIn] = useState<boolean>(false)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)

      try {
        const { auth, apiClient, db } = await import('@/src/api')
        const sessionResult = await auth.getSession()
        const currentUser = sessionResult.data.session?.user

        if (!currentUser) {
          setSignedIn(false)
          return
        }

        setSignedIn(true)

        const [dashboard, coursesData, notificationsData, profileResult] = await Promise.all([
          apiClient.getStaffDashboard(),
          apiClient.getTrades(),
          db.getNotifications(currentUser.id),
          db.getProfile(currentUser.id),
        ])

        setDashboardData(dashboard)
        setCourses(coursesData?.trades || [])
        setNotifications(notificationsData?.data || [])
        setUserFullName(`${profileResult.data?.first_name || ''} ${profileResult.data?.last_name || ''}`.trim() || 'Instructor')
      } catch (error) {
        console.error('Instructor dashboard load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleSignOut = async () => {
    const { auth } = await import('@/src/api')
    await auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Instructor Dashboard</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            You must be signed in to access this page.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-700">Instructor</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Instructor Workspace</h1>
              <p className="mt-2 text-sm text-slate-700 max-w-2xl">
                Welcome back, {userFullName}. Review your active courses, student activity, and notifications in one place.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Sign Out
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Courses Teaching</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{dashboardData?.courses_teaching || 0}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Total Students</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{dashboardData?.total_students || 0}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Avg. Student Rating</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{dashboardData?.average_rating ?? 'N/A'}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">My Courses</h2>
                <p className="text-sm text-slate-700">Courses you are currently teaching.</p>
              </div>
              <Link
                href="/courses/create"
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Create Course
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {courses.length === 0 ? (
                <p className="text-sm text-slate-700">No courses assigned yet.</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{course.name}</h3>
                        <p className="mt-1 text-sm text-slate-700">{course.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                        <span>Duration: {course.duration_months ?? 'N/A'} mos</span>
                        <span>Students: {course.enrolled_students ?? 0}</span>
                        <span>Fee: ${course.tuition_fee ?? 0}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/courses/edit/${course.id}`}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/instructor/courses/${course.id}`}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-700">Recent alerts for your account.</p>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-700">No new notifications.</p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="rounded-3xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                      <p className="mt-2 text-xs text-slate-700">{new Date(notification.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold text-slate-900">Recent Student Activity</h2>
              </div>
              <div className="mt-4 space-y-4">
                {dashboardData?.recent_activities?.length === 0 ? (
                  <p className="text-sm text-slate-700">No recent student activity.</p>
                ) : (
                  dashboardData.recent_activities.map((activity: any, index: number) => (
                    <div key={index} className="rounded-3xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                      <p className="mt-2 text-xs text-slate-700">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
