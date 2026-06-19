'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Truck, Clock, Plus } from 'lucide-react'

interface InventoryBranch {
  id: string
  name: string
}

interface InventoryItem {
  id: string
  item_name: string
  sku?: string
}

interface InventoryTransaction {
  id: string
  transaction_type: string
  quantity: number
  unit_cost: number
  total_cost: number
  notes?: string
  inventory_item?: InventoryItem
  branch?: InventoryBranch
}

export default function InventoryTransfersPage() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [branches, setBranches] = useState<InventoryBranch[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [transactionType, setTransactionType] = useState<'purchase' | 'sale' | 'adjustment' | 'transfer'>('transfer')
  const [quantity, setQuantity] = useState('1')
  const [unitCost, setUnitCost] = useState('0')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadTransfers() {
      setLoading(true)
      try {
        const [transactionResult, itemsResult, branchesResult] = await Promise.all([
          apiClient.getInventoryTransactions(),
          apiClient.getInventoryItems(),
          apiClient.getInventoryBranches(),
        ])
        setTransactions(transactionResult ?? [])
        setItems(itemsResult ?? [])
        setBranches(branchesResult ?? [])
        setSelectedItemId(itemsResult?.[0]?.id ?? '')
        setSelectedBranchId(branchesResult?.[0]?.id ?? '')
      } catch (error) {
        console.error('Failed to load transfers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTransfers()
  }, [])

  const handleCreateTransfer = async () => {
    if (!selectedItemId || !quantity || !unitCost) {
      alert('Asset, quantity, and unit cost are required to log a transfer.')
      return
    }

    setSaving(true)
    try {
      const newTransfer = await apiClient.createInventoryTransaction({
        inventory_item_id: selectedItemId,
        branch_id: selectedBranchId,
        transaction_type: transactionType,
        quantity: Number(quantity),
        unit_cost: Number(unitCost),
        notes,
      })
      setTransactions((current) => [newTransfer, ...current])
      setNotes('')
      alert('Transfer recorded successfully.')
    } catch (error) {
      console.error('Failed to record transfer:', error)
      alert('Unable to save transfer. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const transferCount = transactions.filter((transaction) => transaction.transaction_type === 'transfer').length
  const movementCount = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.quantity), 0)
  const eventCount = transactions.length

  return (
    <PortalSectionShell
      title="Inventory Transfers"
      description="Review recent transfers and manage asset movement between locations."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Transfer events</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{eventCount}</p>
                </div>
                <RefreshCcw className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pure transfers</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{transferCount}</p>
                </div>
                <Clock className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Items moved</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{movementCount}</p>
                </div>
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Log a transfer</CardTitle>
                <p className="text-sm text-slate-600">Create a movement entry for an asset and track stock changes.</p>
              </div>
              <Button variant="outline" onClick={handleCreateTransfer} disabled={saving}>
                <Plus className="mr-2 h-4 w-4" />
                Save transfer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Asset
                <select
                  value={selectedItemId}
                  onChange={(event) => setSelectedItemId(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Branch
                <select
                  value={selectedBranchId}
                  onChange={(event) => setSelectedBranchId(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Type
                <select
                  value={transactionType}
                  onChange={(event) => setTransactionType(event.target.value as any)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="transfer">Transfer</option>
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Quantity
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Unit cost
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unitCost}
                  onChange={(event) => setUnitCost(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="lg:col-span-3 flex flex-col gap-2 text-sm text-slate-800">
                Notes
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="min-h-[92px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  placeholder="Optional transfer notes"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfer history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Asset</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Branch</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Qty</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Unit cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {transactions.map((transfer) => (
                    <tr key={transfer.id}>
                      <td className="px-4 py-4 text-slate-900">{transfer.id}</td>
                      <td className="px-4 py-4 text-slate-700">{transfer.inventory_item?.item_name || 'Unknown asset'}</td>
                      <td className="px-4 py-4 text-slate-700">{transfer.branch?.name || 'Unassigned'}</td>
                      <td className="px-4 py-4 text-slate-700">{transfer.transaction_type}</td>
                      <td className="px-4 py-4 text-slate-700">{transfer.quantity}</td>
                      <td className="px-4 py-4 text-slate-700">₦{transfer.unit_cost.toFixed(2)}</td>
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
