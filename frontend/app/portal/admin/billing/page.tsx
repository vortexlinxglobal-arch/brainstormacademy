'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, FileText, ShieldCheck, TrendingUp } from 'lucide-react'

export default function AdminBillingPage() {
  return (
    <PortalSectionShell
      title="Billing & Receipts"
      description="Monitor payments, generate receipts, and track revenue across courses."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">₦12.8M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Total collected fees for active cohorts.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Invoices</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">14</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Unsettled student fees ready for follow up.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Receipts Issued</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">88</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Receipts generated for student payments.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Secure Payment</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">100%</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">All transactions are monitored and secured.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Recent payments</CardTitle>
                <p className="text-sm text-slate-600">Latest student transactions and receipts.</p>
              </div>
              <Button variant="outline">View ledger</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Course</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {[
                    ['Amina Idris', '₦120,000', 'Electrical Installation', 'Paid'],
                    ['Abbas Adamu', '₦90,000', 'Fashion Design', 'Paid'],
                    ['Habiba Muhammad', '₦150,000', 'Hospitality Training', 'Pending'],
                  ].map(([name, amount, course, status]) => (
                    <tr key={name + amount}>
                      <td className="px-4 py-4 text-slate-900">{name}</td>
                      <td className="px-4 py-4 text-slate-700">{amount}</td>
                      <td className="px-4 py-4 text-slate-700">{course}</td>
                      <td className="px-4 py-4 text-slate-700">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
