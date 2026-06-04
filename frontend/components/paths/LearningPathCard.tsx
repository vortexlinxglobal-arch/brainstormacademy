'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, CircleDot, Sparkles, Target } from 'lucide-react'

export interface LearningPathStep {
  title: string
  subtitle: string
  completed: boolean
  milestone?: boolean
}

export interface LearningPathCardProps {
  pathName: string
  description: string
  steps: LearningPathStep[]
  completion: number
}

export function LearningPathCard({ pathName, description, steps, completion }: LearningPathCardProps) {
  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="px-6 pt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-[#1a6b53] text-white">
              Learning Path
            </Badge>
            <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {completion}% complete
            </Badge>
          </div>
          <CardTitle>{pathName}</CardTitle>
          <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="relative flex items-start gap-4"
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100">
                  {step.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <CircleDot className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                    {step.milestone ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                        Milestone
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>Path progress</span>
              <span>{completion}% complete</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-[#1a6b53]" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Next activity</p>
              <div className="mt-3 flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <p className="font-semibold">Complete module 4 assessment</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Badge goal</p>
              <div className="mt-3 flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <Target className="h-5 w-5 text-amber-500" />
                <p className="font-semibold">Earn practical mastery badge</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
