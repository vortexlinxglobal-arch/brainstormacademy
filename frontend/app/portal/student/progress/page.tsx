'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'

export default function StudentProgressPage() {
  const progressData = [
    {
      course: 'Advanced Nursing Science',
      progress: 75,
      completedLessons: 9,
      totalLessons: 12,
      lastAccessed: '2 hours ago',
    },
    {
      course: 'IT Fundamentals',
      progress: 60,
      completedLessons: 6,
      totalLessons: 10,
      lastAccessed: '1 day ago',
    },
    {
      course: 'Business Management',
      progress: 45,
      completedLessons: 5,
      totalLessons: 11,
      lastAccessed: '3 days ago',
    },
  ]

  return (
    <PortalSectionShell
      title="My Progress"
      description="Track your learning achievements and course completion"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-700 font-medium">Overall Progress</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">60%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-700 font-medium">Lessons Completed</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">20</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-700 font-medium">Certificates Earned</p>
                  <p className="mt-2 text-3xl font-bold text-purple-600">1</p>
                </div>
                <Award className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {progressData.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">{item.course}</h3>
                    <span className="text-sm font-bold text-emerald-600">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-700">
                    <span>{item.completedLessons}/{item.totalLessons} lessons</span>
                    <span>Last accessed: {item.lastAccessed}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
                <p className="text-sm text-amber-700 font-medium">Current Streak</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">7 days</p>
                <p className="text-xs text-amber-600 mt-2">Keep it up! 🔥</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
                <p className="text-sm text-emerald-700 font-medium">Longest Streak</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">21 days</p>
                <p className="text-xs text-emerald-600 mt-2">Great commitment!</p>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
                <p className="text-sm text-blue-700 font-medium">Total Hours</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">48 hrs</p>
                <p className="text-xs text-blue-600 mt-2">Excellent dedication</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
