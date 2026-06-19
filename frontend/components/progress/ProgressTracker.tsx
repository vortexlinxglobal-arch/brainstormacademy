'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export interface ProgressCourse {
  id: string
  title: string
  moduleCount: number
  completedModules: number
  status: 'on-track' | 'behind' | 'at-risk'
  color?: string
}

export interface ProgressTrackerProps {
  overallCompletion: number
  courses: ProgressCourse[]
  nextMilestone: string
}

const statusLabel = (status: ProgressCourse['status']) => {
  switch (status) {
    case 'on-track':
      return { label: 'On track', color: 'bg-emerald-100 text-emerald-700' }
    case 'behind':
      return { label: 'Behind', color: 'bg-amber-100 text-amber-700' }
    default:
      return { label: 'At risk', color: 'bg-rose-100 text-rose-700' }
  }
}

export function ProgressTracker({ overallCompletion, courses, nextMilestone }: ProgressTrackerProps) {
  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="px-6 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Progress tracker</CardTitle>
            <p className="text-sm text-slate-700 dark:text-slate-400">Visualize your overall completion and course progress at a glance.</p>
          </div>
          <Badge variant="secondary" className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            {nextMilestone}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8 px-6 pb-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-md shadow-slate-200/40 dark:bg-slate-950 dark:shadow-black/20">
              <span className="text-5xl font-semibold text-[#1a6b53]">{overallCompletion}%</span>
            </div>
            <p className="mt-5 text-sm text-slate-700 dark:text-slate-400">Complete program achievement</p>
          </motion.div>

          <div className="space-y-5">
            {courses.map((course) => {
              const pct = Math.round((course.completedModules / course.moduleCount) * 100)
              const status = statusLabel(course.status)
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{course.title}</h3>
                      <p className="text-sm text-slate-700 dark:text-slate-400">{course.completedModules}/{course.moduleCount} modules complete</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-700 dark:text-slate-400">
                    <p>{course.moduleCount} modules</p>
                    <p>{pct}%</p>
                  </div>
                  <div className="mt-3">
                    <Progress value={pct} className="h-3 rounded-full" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold">Focus on practical steps to maintain momentum.</p>
          </div>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-400">
            Complete at least one module every two days to keep your NSQ certification pathway on track.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
