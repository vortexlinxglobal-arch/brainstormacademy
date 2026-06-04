'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface Branch {
  id: number
  name: string
  location: string
  manager: string
  revenue: number
  active: boolean
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setBranches([
      { id: 1, name: 'Main Academy', location: 'Central Campus', manager: 'Esther A.', revenue: 5200, active: true },
      { id: 2, name: 'Innovation Hub', location: 'North Campus', manager: 'Prince O.', revenue: 3800, active: true },
      { id: 3, name: 'TradeWorks Center', location: 'East Campus', manager: 'Ola M.', revenue: 2900, active: false },
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a6b53]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Branch Management</h2>
          <p className="text-sm text-slate-600">Monitor operations, capacity, and branch performance across the business center.</p>
        </div>
        <Button>Add New Branch</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Branches</CardTitle>
            <CardDescription>{branches.length} locations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{branches.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Operations</CardTitle>
            <CardDescription>Branches currently open</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{branches.filter((branch) => branch.active).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Run Rate</CardTitle>
            <CardDescription>Estimated monthly intake</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">₦{branches.reduce((sum, branch) => sum + branch.revenue, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Directory</CardTitle>
          <CardDescription>Review branch details and operational status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{branch.name}</td>
                    <td className="py-4 px-4">{branch.location}</td>
                    <td className="py-4 px-4">{branch.manager}</td>
                    <td className="py-4 px-4">₦{branch.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge variant={branch.active ? 'default' : 'outline'}>
                        {branch.active ? 'Active' : 'Closed'}
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
