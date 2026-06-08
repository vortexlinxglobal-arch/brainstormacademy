'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

interface InventoryBranch {
  id: string
  name: string
}

interface InventoryItem {
  id: string
  item_name: string
  sku?: string
  description?: string
  quantity: number
  unit_cost: number
  branch?: InventoryBranch
}

export default function InventoryAssetsPage() {
  const [assets, setAssets] = useState<InventoryItem[]>([])
  const [filteredAssets, setFilteredAssets] = useState<InventoryItem[]>([])
  const [branches, setBranches] = useState<InventoryBranch[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('')
  
  // Create form state
  const [itemName, setItemName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitCost, setUnitCost] = useState('0')
  const [selectedBranchId, setSelectedBranchId] = useState('')

  // Edit modal state
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [editItemName, setEditItemName] = useState('')
  const [editSku, setEditSku] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editQuantity, setEditQuantity] = useState('')
  const [editUnitCost, setEditUnitCost] = useState('')
  const [editBranchId, setEditBranchId] = useState('')

  // Delete confirmation state
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    async function loadAssets() {
      setLoading(true)
      try {
        const branchResult = await apiClient.getInventoryBranches()
        setBranches(branchResult ?? [])
        setSelectedBranchId(branchResult?.[0]?.id ?? '')

        const inventoryResult = await apiClient.getInventoryItems()
        setAssets(inventoryResult ?? [])
      } catch (error) {
        console.error('Failed to load inventory assets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  // Filter assets based on search term and branch
  useEffect(() => {
    let filtered = assets

    if (selectedBranchFilter) {
      filtered = filtered.filter((asset) => asset.branch?.id === selectedBranchFilter)
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (asset) =>
          asset.item_name.toLowerCase().includes(lowerSearch) ||
          (asset.sku?.toLowerCase().includes(lowerSearch) ?? false) ||
          (asset.description?.toLowerCase().includes(lowerSearch) ?? false)
      )
    }

    setFilteredAssets(filtered)
  }, [searchTerm, selectedBranchFilter, assets])

  const createAsset = async () => {
    if (!itemName || !quantity || !unitCost) {
      alert('Item name, quantity, and unit cost are required.')
      return
    }

    setSaving(true)
    try {
      const newItem = await apiClient.createInventoryItem({
        item_name: itemName,
        sku,
        description,
        quantity: Number(quantity),
        unit_cost: Number(unitCost),
        branch_id: selectedBranchId,
      })
      setAssets((current) => [newItem, ...current])
      setItemName('')
      setSku('')
      setDescription('')
      setQuantity('1')
      setUnitCost('0')
      alert('Asset successfully recorded.')
    } catch (error) {
      console.error('Create asset failed:', error)
      alert('Unable to save asset. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (asset: InventoryItem) => {
    setEditingItem(asset)
    setEditItemName(asset.item_name)
    setEditSku(asset.sku || '')
    setEditDescription(asset.description || '')
    setEditQuantity(String(asset.quantity))
    setEditUnitCost(String(asset.unit_cost))
    setEditBranchId(asset.branch?.id || '')
  }

  const closeEditModal = () => {
    setEditingItem(null)
    setEditItemName('')
    setEditSku('')
    setEditDescription('')
    setEditQuantity('')
    setEditUnitCost('')
    setEditBranchId('')
  }

  const saveEdit = async () => {
    if (!editingItem) return

    if (!editItemName || !editQuantity || !editUnitCost) {
      alert('Item name, quantity, and unit cost are required.')
      return
    }

    setSaving(true)
    try {
      await apiClient.updateInventoryItem(editingItem.id, {
        item_name: editItemName,
        sku: editSku,
        description: editDescription,
        quantity: Number(editQuantity),
        unit_cost: Number(editUnitCost),
        branch_id: editBranchId,
      })

      setAssets((current) =>
        current.map((asset) =>
          asset.id === editingItem.id
            ? {
                ...asset,
                item_name: editItemName,
                sku: editSku,
                description: editDescription,
                quantity: Number(editQuantity),
                unit_cost: Number(editUnitCost),
                branch: branches.find((b) => b.id === editBranchId) || asset.branch,
              }
            : asset
        )
      )

      closeEditModal()
      alert('Asset updated successfully.')
    } catch (error) {
      console.error('Update asset failed:', error)
      alert('Unable to update asset. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (asset: InventoryItem) => {
    setDeletingItem(asset)
  }

  const deleteAsset = async () => {
    if (!deletingItem) return

    setSaving(true)
    try {
      await apiClient.deleteInventoryItem(deletingItem.id)
      setAssets((current) => current.filter((asset) => asset.id !== deletingItem.id))
      setDeletingItem(null)
      alert('Asset deleted successfully.')
    } catch (error) {
      console.error('Delete asset failed:', error)
      alert('Unable to delete asset. It may have related transactions.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PortalSectionShell title="Inventory Assets" description="Manage academy assets, tags, and stock status." allowedRoles={['Admin', 'Manager', 'Staff']}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Assets register</h2>
            <p className="mt-2 text-sm text-slate-600">Track tagged equipment and asset status across locations.</p>
          </div>
          <Button onClick={createAsset} disabled={saving}>
            <Plus className="mr-2 h-4 w-4" />
            Save asset
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Search assets, tags, or locations"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  Branch
                  <select
                    value={selectedBranchFilter}
                    onChange={(event) => setSelectedBranchFilter(event.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  >
                    <option value="">All branches</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-3">
                  <Button variant="outline">Export CSV</Button>
                  <Button variant="outline">Export PDF</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add new asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Item name
                <input
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  placeholder="e.g. Laptop, Projector"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                SKU
                <input
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="e.g. COMP-001"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Quantity
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                Description
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional asset details"
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
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Branch
                <select
                  value={selectedBranchId}
                  onChange={(event) => setSelectedBranchId(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="">Select branch...</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset list ({filteredAssets.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-600">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-600">No assets found.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">SKU</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Quantity</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Cost</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Branch</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-4 py-4 text-slate-900">{asset.item_name}</td>
                        <td className="px-4 py-4 text-slate-700">{asset.sku || '—'}</td>
                        <td className="px-4 py-4 text-slate-700">{asset.quantity}</td>
                        <td className="px-4 py-4 text-slate-700">₦{asset.unit_cost.toFixed(2)}</td>
                        <td className="px-4 py-4 text-slate-700">{asset.branch?.name || 'Unassigned'}</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(asset)}
                              className="rounded-lg bg-blue-50 p-2 hover:bg-blue-100"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => confirmDelete(asset)}
                              className="rounded-lg bg-red-50 p-2 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Edit Asset</CardTitle>
                <button
                  onClick={closeEditModal}
                  className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Item name
                    <input
                      value={editItemName}
                      onChange={(e) => setEditItemName(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    SKU
                    <input
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Quantity
                    <input
                      type="number"
                      min="0"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Unit cost
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editUnitCost}
                      onChange={(e) => setEditUnitCost(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                    Description
                    <input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Branch
                    <select
                      value={editBranchId}
                      onChange={(e) => setEditBranchId(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="">Select branch...</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={closeEditModal} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={saveEdit} disabled={saving}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Delete Asset?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete <strong>{deletingItem.item_name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setDeletingItem(null)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={deleteAsset} disabled={saving}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalSectionShell>
  )
}
