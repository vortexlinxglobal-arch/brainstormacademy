'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FinanceRow {
  id: number
  title: string
  amount: number
  status: 'On Target' | 'Behind' | 'Ahead'
}

export default function FinancePage() {
  const [stats, setStats] = useState<FinanceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStats([
      { id: 1, title: 'Branch Revenue', amount: 126400, status: 'On Target' },
      { id: 2, title: 'Business Services', amount: 85400, status: 'Ahead' },
      { id: 3, title: 'Admin Fees', amount: 21400, status: 'Behind' },
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Performance</h2>
          <p className="text-sm text-slate-600">Review revenue, cash flow, and business center profitability.</p>
        </div>
        <Button variant="secondary">Generate Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">₦232,800</p>
            <p className="text-sm text-slate-500 mt-2">Business center receipts for the current month.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">18%</p>
            <p className="text-sm text-slate-500 mt-2">Net margin after operating expenses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">₦98,200</p>
            <p className="text-sm text-slate-500 mt-2">Available business funds and advances.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finance Overview</CardTitle>
          <CardDescription>Tracked by revenue category and performance trend.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{row.title}</td>
                    <td className="py-4 px-4">₦{row.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge variant={row.status === 'Ahead' ? 'default' : row.status === 'On Target' ? 'secondary' : 'outline'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
