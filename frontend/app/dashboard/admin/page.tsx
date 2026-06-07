'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin Overview</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Administrator Workspace</h1>
            <p className="mt-3 text-sm text-slate-600 max-w-2xl">
              Get a quick snapshot of active business operations, program pipelines, and student engagement.
            </p>
          </div>
          <Button>Review Reports</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">42</p>
            <p className="mt-2 text-sm text-slate-600">Programs currently visible in the public catalog.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">128</p>
            <p className="mt-2 text-sm text-slate-600">Prospective learners in active registration and onboarding.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">18</p>
            <p className="mt-2 text-sm text-slate-600">Skill tracks and trade programs available for enrollment.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
