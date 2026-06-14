'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Menu, Search, X } from 'lucide-react'

interface DashboardLink {
  label: string
  href: string
}

interface DashboardShellProps {
  title: string
  description: string
  allowedRoles: string[]
  userName: string
  navLinks: DashboardLink[]
  children: React.ReactNode
}

export function DashboardShell({
  title,
  description,
  allowedRoles,
  userName,
  navLinks,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <PortalSectionShell title={title} description={description} allowedRoles={allowedRoles}>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-6 hidden h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Navigation</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Learning hub</h2>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Need help?</p>
            <p className="mt-2">Reach out to your training coach for timeline support and certification guidance.</p>
          </div>
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex h-full w-full max-w-xs flex-col gap-6 overflow-y-auto bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Navigation</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Learning hub</h2>
                </div>
                <button
                  type="button"
                  aria-label="Close sidebar"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto rounded-[1.75rem] bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Need help?</p>
                <p className="mt-2">Reach out to your training coach for timeline support and certification guidance.</p>
              </div>
            </div>
          </div>
        ) : null}

        <main className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Welcome back, {userName}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                  Your student dashboard is designed to keep your progress, lessons, and skill goals clearly visible.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:w-[320px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search courses, lessons, skills"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-3xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e54]"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Menu
                </button>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </PortalSectionShell>
  )
}
