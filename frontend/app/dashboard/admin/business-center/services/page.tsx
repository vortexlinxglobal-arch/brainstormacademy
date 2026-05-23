'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ServiceItem {
  id: number
  name: string
  category: string
  uptake: number
  status: 'Live' | 'Pilot' | 'Review'
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setServices([
      { id: 1, name: 'Small Business Coaching', category: 'Entrepreneurship', uptake: 92, status: 'Live' },
      { id: 2, name: 'Trade Startup Planning', category: 'Business Development', uptake: 78, status: 'Pilot' },
      { id: 3, name: 'Market Readiness Audit', category: 'Consulting', uptake: 64, status: 'Review' },
      { id: 4, name: 'Sales & Finance Clinic', category: 'Finance', uptake: 85, status: 'Live' },
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
          <h2 className="text-2xl font-bold text-slate-900">Service Portfolio</h2>
          <p className="text-sm text-slate-600">Manage business center service lines and monitor trainee uptake.</p>
        </div>
        <Button>Add Service</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Uptake</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">80%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services in Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">4</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Catalog</CardTitle>
          <CardDescription>See program category, adoption, and launch stage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Uptake</th>
                  <th className="py-3 px-4">Stage</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{service.name}</td>
                    <td className="py-4 px-4">{service.category}</td>
                    <td className="py-4 px-4">{service.uptake}%</td>
                    <td className="py-4 px-4">
                      <Badge variant={service.status === 'Live' ? 'default' : 'outline'}>
                        {service.status}
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
