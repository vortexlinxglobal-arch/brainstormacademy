'use client'

import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface AnalyticsMetric {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'steady'
  sparkline: number[]
  accent?: string
}

export interface AnalyticsOverviewCardsProps {
  metrics: AnalyticsMetric[]
}

const sparklinePath = (points: number[]) => {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const width = 100
  const step = width / Math.max(points.length - 1, 1)

  return points
    .map((point, index) => {
      const y = max === min ? 50 : 90 - ((point - min) / (max - min)) * 60
      return `${index * step},${y}`
    })
    .join(' ')
}

export function AnalyticsOverviewCards({ metrics }: AnalyticsOverviewCardsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      {metrics.map((metric) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-col gap-4 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{metric.label}</p>
                  <CardTitle className="mt-2 text-3xl text-slate-900 dark:text-slate-100">{metric.value}</CardTitle>
                </div>
                <Badge variant="secondary" className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <span className="inline-flex items-center gap-1">
                    {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : metric.trend === 'down' ? <ArrowDownRight className="h-4 w-4 text-rose-500" /> : <TrendingUp className="h-4 w-4 text-slate-500" />}
                    {metric.delta}
                  </span>
                </Badge>
              </div>
              <div className="relative flex h-24 items-end overflow-hidden rounded-[1.5rem] bg-slate-50 p-4 dark:bg-slate-900">
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full"
                  aria-hidden="true"
                >
                  <polyline
                    fill="none"
                    stroke={metric.accent ?? '#0A6C3F'}
                    strokeWidth="3"
                    points={sparklinePath(metric.sparkline)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
