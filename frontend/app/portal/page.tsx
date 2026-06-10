'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/src/api'

const roleRedirects: Record<string, string> = {
  admin: '/portal/admin',
  manager: '/portal/admin',
  instructor: '/portal/instructor',
  student: '/portal/student',
}

const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || ''

export default function PortalLandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (portalUrl && typeof window !== 'undefined' && window.location.origin !== portalUrl) {
      window.location.assign(`${portalUrl}/portal`)
      return
    }

    async function load() {
      setLoading(true)

      try {
        const sessionResult = await auth.getSession()
        const user = sessionResult.data.session?.user

        if (!user) {
          router.replace('/signin')
          return
        }

        const profileResult = await db.getProfile(user.id)
        if (!profileResult.data || profileResult.error) {
          setError(profileResult.error?.message || 'Unable to load profile data.')
          setLoading(false)
          return
        }

        const normalizedRole = profileResult.data.role?.toLowerCase() || ''
        const redirectPath = roleRedirects[normalizedRole]

        if (redirectPath) {
          setRedirecting(true)
          router.replace(redirectPath)
          return
        }

        setError(`Your account role (${profileResult.data.role}) does not have a dedicated portal section yet. Please contact support.`)
      } catch (err) {
        console.error('Portal landing load failed:', err)
        setError('Unable to verify your account role at this time.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-700">Portal</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Brainstorm Academy Portal</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            Access your workspace based on your assigned role. If you are already signed in, you will be routed to the correct portal section automatically.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              Sign Up
            </Link>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href="/portal/admin"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-500 hover:shadow-lg"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-700">Admin Portal</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Management & operations</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">View reports, manage programs, and oversee student and instructor workflows.</p>
          </Link>

          <Link
            href="/portal/instructor"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-500 hover:shadow-lg"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-700">Instructor Portal</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Teaching & course management</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">Manage your classes, assignments, and student progress in one place.</p>
          </Link>

          <Link
            href="/portal/student"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-500 hover:shadow-lg"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-700">Student Portal</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Learning & progress</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">Browse courses, track your progress, and stay connected with your learning plan.</p>
          </Link>
        </div>

        <div className="mx-auto mt-8 max-w-6xl grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Role-aware access',
              description:
                'Users are routed automatically to the correct portal experience based on their account role, reducing manual navigation and friction.',
            },
            {
              title: 'Clear workspace entry points',
              description:
                'Dedicated paths for administrators, instructors, and students create a more intuitive operational flow.',
            },
            {
              title: 'Real-time session validation',
              description:
                'Fast session checks and redirect behavior make the portal feel responsive and secure for every visitor.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Portal design</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
