'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCard, CourseCardProps } from '@/components/cards/CourseCard'
import { Progress } from '@/components/ui/progress'
import { Avatar } from '@/components/ui/avatar'
import { ArrowUpRight, CheckCircle2, Clock3, Sparkles, Trophy } from 'lucide-react'

export interface ContinueLearningCourse {
  id: string
  title: string
  thumbnail: string
  progress: number
  module: string
  dueIn: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  href: string
}

export interface AchievementBadge {
  title: string
  description: string
  icon: 'trophy' | 'sparkles' | 'check'
}

export interface UpcomingDeadline {
  title: string
  course: string
  dueDate: string
  status: string
}

export interface StudentDashboardProps {
  profile: {
    name: string
    avatarUrl?: string
    role: string
    streak: number
  }
  continueLearning: ContinueLearningCourse[]
  recommendedCourses: CourseCardProps[]
  achievements: AchievementBadge[]
  deadlines: UpcomingDeadline[]
}

const getBadgeIcon = (icon: AchievementBadge['icon']) => {
  switch (icon) {
    case 'sparkles':
      return <Sparkles className="h-5 w-5" />
    case 'trophy':
      return <Trophy className="h-5 w-5" />
    default:
      return <CheckCircle2 className="h-5 w-5" />
  }
}

export function StudentDashboard({ profile, continueLearning, recommendedCourses, achievements, deadlines }: StudentDashboardProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="bg-gradient-to-br from-[#0A6C3F] to-[#07542f] text-white overflow-hidden">
          <CardContent className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_30%)] p-8 sm:p-10">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Welcome back</p>
                  <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">Hi {profile.name}, keep the momentum going.</h1>
                </div>
                <Avatar imageSrc={profile.avatarUrl} name={profile.name} size="lg" />
              </div>
              <p className="max-w-2xl text-sm text-emerald-100/90 sm:text-base">
                Continue your approved NSQ-certified training and finish the practical assignments on schedule. Your learning path is waiting.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Learning streak</p>
                  <p className="mt-2 text-3xl font-semibold">{profile.streak} days</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Current program</p>
                  <p className="mt-2 text-3xl font-semibold">Business Center Management</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Next live class</p>
                  <p className="mt-2 text-3xl font-semibold">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Skills progress</CardTitle>
                  <CardDescription>Review pace and top skill badges for your current path.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                  {profile.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>Course completion</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">68%</span>
                </div>
                <Progress value={68} className="h-3 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>NSQ level competency</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Advanced</span>
                </div>
                <Progress value={82} className="h-3 rounded-full" />
              </div>
              <Button variant="default" size="lg" className="w-full">
                Continue learning
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Upcoming milestones</CardTitle>
                <CardDescription>Stay on track with practical assignments and live sessions.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deadlines.map((deadline) => (
                <div key={deadline.title} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{deadline.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{deadline.course}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      {deadline.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Due {deadline.dueDate}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Continue learning</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Resume your highest-priority practical courses.</p>
          </div>
          <Button variant="secondary" size="lg">View all courses</Button>
        </div>

        <div className="grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 xl:grid-cols-3">
          {continueLearning.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4 }}
              className="min-w-[280px] rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">{course.level}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{course.title}</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#0A6C3F]/10 px-3 py-1 text-xs font-semibold text-[#0A6C3F]">{course.dueIn}</span>
              </div>
              <div className="mt-5 h-40 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{course.module}</span>
                  <span>{course.progress}% complete</span>
                </div>
                <Progress value={course.progress} className="h-3 rounded-full" />
              </div>
              <Button variant="default" size="sm" className="mt-4 w-full">
                Resume
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Recommended for you</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Courses aligned with your career pathway and certification goals.</p>
          </div>
          <Button variant="default" size="lg">Browse all tracks</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Skill badges and achievements</CardTitle>
              <CardDescription>Track the credentials you’re unlocking across the vocational curriculum.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center gap-3 text-[#0A6C3F]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-[#0A6C3F] shadow-sm">
                    {getBadgeIcon(achievement.icon)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{achievement.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live classes & deadlines</CardTitle>
              <CardDescription>Stay ahead with the next sessions and key dates.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Live class</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Practical Business Center Review</h3>
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                  Today
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>9:00 AM - 11:00 AM</span>
                <span>Zoom session</span>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Assignment</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Module 3 Practicum</h3>
                </div>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  In 2 days
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
