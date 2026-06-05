'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const instructorNav = [
  { href: '/dashboard/instructor', label: 'Overview' },
  { href: '/dashboard/instructor/courses', label: 'Courses' },
  { href: '/dashboard/instructor/students', label: 'Students' },
  { href: '/dashboard/instructor/notifications', label: 'Notifications' },
]

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Instructor</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Instructor Workspace</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Manage your courses, review student progress, and stay in control of your classroom.
            </p>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {instructorNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-[#1a6b53] bg-[#F2F9F3] text-[#1a6b53]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  )
}
