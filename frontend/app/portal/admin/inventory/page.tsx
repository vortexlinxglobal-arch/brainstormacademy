'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, MapPin, RefreshCcw, Truck } from 'lucide-react'
import Link from 'next/link'

export default function AdminInventoryPage() {
  return (
    <PortalSectionShell title="Inventory Control" description="Track assets, locations, transfers, and stock health." allowedRoles={['Admin', 'Manager', 'Staff']}>
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Assets</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">85</p>
                </div>
                <Package className="h-8 w-8 text-emerald-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Complete register of all equipment, supplies, and facilities.</p>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-amber-50">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Asset Value</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">₦2.03M</p>
                </div>
                <RefreshCcw className="h-8 w-8 text-amber-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Value across live, store, and repair inventories.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Top Location</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">Computer Lab</p>
                </div>
                <MapPin className="h-8 w-8 text-slate-700" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Most valuable inventory concentration across the academy.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Inventory actions</CardTitle>
                <p className="text-sm text-slate-600">Fast paths for asset registration and transfers.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/portal/admin/inventory/assets/add">
                  <Button variant="outline">Add Asset</Button>
                </Link>
                <Link href="/portal/admin/inventory/transfers">
                  <Button variant="outline">Transfer Items</Button>
                </Link>
                <Link href="/portal/admin/inventory/locations">
                  <Button variant="outline">Manage Locations</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Asset Tag</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {[
                    ['COMP-KBD-00085', 'Keyboards', 'Computer Lab', 'In use'],
                    ['COMP-PC-00075', 'Desktops', 'Computer Lab', 'Registered'],
                    ['CHAIR-0010', 'Chairs', 'Main Store', 'Store'],
                  ].map(([tag, type, location, status]) => (
                    <tr key={tag}>
                      <td className="px-4 py-4 text-slate-900">{tag}</td>
                      <td className="px-4 py-4 text-slate-700">{type}</td>
                      <td className="px-4 py-4 text-slate-700">{location}</td>
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
