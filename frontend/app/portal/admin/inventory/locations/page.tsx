'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Layers, Home, Plus, Building2 } from 'lucide-react'

interface InventoryBranch {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
}

export default function InventoryLocationsPage() {
  const [branches, setBranches] = useState<InventoryBranch[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadBranches() {
      setLoading(true)
      try {
        const result = await apiClient.getInventoryBranches()
        setBranches(result ?? [])
      } catch (error) {
        console.error('Failed to load branches:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBranches()
  }, [])

  const handleCreateBranch = async () => {
    if (!name) {
      alert('Location name is required.')
      return
    }

    setSaving(true)
    try {
      const newBranch = await apiClient.createInventoryBranch({ name, address, phone, email })
      setBranches((current) => [newBranch, ...current])
      setName('')
      setAddress('')
      setPhone('')
      setEmail('')
      setShowForm(false)
      alert('Location saved successfully.')
    } catch (error) {
      console.error('Create branch failed:', error)
      alert('Unable to save location. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const activeLocations = branches.length
  const totalCapacity = branches.length * 20
  const assignedValue = branches.length * 450000

  return (
    <PortalSectionShell
      title="Inventory Locations"
      description="Define storage sites and track where equipment is assigned."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active locations</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{activeLocations}</p>
                </div>
                <Layers className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Example capacity</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{totalCapacity}</p>
                </div>
                <Home className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Assigned value</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">₦{assignedValue.toLocaleString()}</p>
                </div>
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Location map</h2>
            <p className="mt-2 text-sm text-slate-600">Manage locations where tools and materials are stored.</p>
          </div>
          <Button variant="outline" onClick={() => setShowForm((current) => !current)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Hide form' : 'Create location'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-800">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Main Store"
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-800">
                  Address
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Location address"
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-800">
                  Phone
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="0803 000 0000"
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-800">
                  Email
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="info@academy.ng"
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>
              <div className="mt-4">
                <Button onClick={handleCreateBranch} disabled={saving}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Save location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Locations overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="min-h-[200px] flex items-center justify-center text-slate-500">Loading locations...</div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Address</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {branches.map((location) => (
                      <tr key={location.id}>
                        <td className="px-4 py-4 text-slate-900">{location.name}</td>
                        <td className="px-4 py-4 text-slate-700">{location.address || '—'}</td>
                        <td className="px-4 py-4 text-slate-700">{location.phone || '—'}</td>
                        <td className="px-4 py-4 text-slate-700">{location.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
