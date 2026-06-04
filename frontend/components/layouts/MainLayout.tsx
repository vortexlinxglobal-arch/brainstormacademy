'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

export type UserRole = 'Admin' | 'Manager' | 'Instructor' | 'Student'

export interface MainLayoutProps {
  children: React.ReactNode
  profile: {
    name: string
    email: string
    role: UserRole
    avatarUrl?: string
    notifications?: number
  }
  activePath?: string
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['Admin', 'Manager', 'Instructor', 'Student'] as UserRole[],
  },
  {
    label: 'Browse Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['Admin', 'Manager', 'Instructor', 'Student'] as UserRole[],
  },
  {
    label: 'My Learning',
    href: '/my-learning',
    icon: Layers,
    roles: ['Instructor', 'Student'] as UserRole[],
  },
  {
    label: 'Community',
    href: '/community',
    icon: Users,
    roles: ['Admin', 'Manager', 'Instructor', 'Student'] as UserRole[],
  },
  {
    label: 'Certificates',
    href: '/certificates',
    icon: Award,
    roles: ['Admin', 'Manager', 'Instructor', 'Student'] as UserRole[],
  },
  {
    label: 'Business Center',
    href: '/business-center',
    icon: Briefcase,
    roles: ['Admin', 'Manager', 'Instructor'] as UserRole[],
  },
  {
    label: 'Manage Students',
    href: '/admin/students',
    icon: Users,
    roles: ['Admin', 'Manager'] as UserRole[],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['Admin', 'Manager', 'Instructor'] as UserRole[],
  },
  {
    label: 'Content Studio',
    href: '/admin/content',
    icon: Settings,
    roles: ['Admin', 'Manager'] as UserRole[],
  },
]

export function MainLayout({ children, profile, activePath = '/dashboard' }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = useMemo(
    () => navItems.filter((item) => item.roles.includes(profile.role)),
    [profile.role]
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={
            'hidden w-80 flex-col border-r border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex ' +
            (sidebarOpen ? 'max-w-[320px]' : 'max-w-[96px]')
          }
        >
          <div className="flex h-full flex-col justify-between px-4 py-6">
            <div>
              <div className="flex items-center gap-3 px-2 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a6b53] shadow-lg shadow-[#1a6b53]/20">
                  <span className="text-lg font-bold text-white">BA</span>
                </div>
                {sidebarOpen ? (
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Brainstorm
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">Skills Academy</p>
                  </div>
                ) : null}
              </div>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = activePath === item.href
                  return (
                    <Link key={item.href} href={item.href} passHref>
                      <a
                        className={
                          'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ' +
                          (active
                            ? 'bg-[#1a6b53] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900')
                        }
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:group-hover:bg-slate-800">
                          <Icon className="h-5 w-5" />
                        </span>
                        {sidebarOpen ? item.label : <span className="sr-only">{item.label}</span>}
                      </a>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex-1">
                <p className="text-slate-500 dark:text-slate-400">Sidebar</p>
                {sidebarOpen ? <p className="font-semibold text-slate-900 dark:text-slate-100">{sidebarOpen ? 'Expanded' : 'Compact'}</p> : null}
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => setSidebarOpen((value) => !value)}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
          >
            <div className="container-fluid flex h-20 items-center gap-4 px-0">
              <div className="flex flex-1 items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen((value) => !value)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="relative flex flex-1 items-center">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    aria-label="Search courses, dashboards, resources"
                    placeholder="Search courses, dashboards, resources"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-700 dark:text-slate-200"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {profile.notifications ? (
                    <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-semibold text-white">
                      {profile.notifications}
                    </span>
                  ) : null}
                </Button>
                <div className="hidden items-center gap-3 md:flex">
                  <Avatar imageSrc={profile.avatarUrl} name={profile.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.name}</p>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                      {profile.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-700 dark:text-slate-200"
                  aria-label="Open account menu"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePath}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <div className="fixed inset-x-0 bottom-0 z-40 block border-t border-slate-200 bg-white/95 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              {menuItems.slice(0, 4).map((item) => {
                const Icon = item.icon
                const active = activePath === item.href
                return (
                  <Link key={item.href} href={item.href} className="flex-1 text-center" aria-label={item.label}>
                    <div className="flex flex-col items-center gap-1 text-xs">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                          active ? 'bg-[#1a6b53] text-white' : 'text-slate-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
