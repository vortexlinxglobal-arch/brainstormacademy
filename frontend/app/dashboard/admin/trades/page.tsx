'use client'

import { FormEvent, useEffect, useState } from 'react'
import { apiClient } from '@/src/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'

interface AdminTrade {
  id: number
  code: string
  name: string
  description?: string
  duration_months: number
  tuition_fee?: number
  is_active: boolean
  category_name?: string
  category_code?: string
  prerequisites?: any
  curriculum?: any
}

interface TradeCategory {
  id: number
  code: string
  name: string
}

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<AdminTrade[]>([])
  const [categories, setCategories] = useState<TradeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrade, setSelectedTrade] = useState<AdminTrade | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [categoryCode, setCategoryCode] = useState('')
  const [tradeCode, setTradeCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [durationMonths, setDurationMonths] = useState(12)
  const [tuitionFee, setTuitionFee] = useState(0)
  const [prerequisites, setPrerequisites] = useState('')
  const [curriculum, setCurriculum] = useState('')
  const [isActive, setIsActive] = useState(true)

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [tradesResponse, categoriesResponse] = await Promise.all([
        apiClient.getTrades(),
        apiClient.getTradeCategories(),
      ])
      setTrades(tradesResponse.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load trade data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setSelectedTrade(null)
    setCategoryCode('')
    setTradeCode('')
    setName('')
    setDescription('')
    setDurationMonths(12)
    setTuitionFee(0)
    setPrerequisites('')
    setCurriculum('')
    setIsActive(true)
    setMessage(null)
    setError(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (trade: AdminTrade) => {
    setSelectedTrade(trade)
    setCategoryCode(trade.category_code || '')
    setTradeCode(trade.code)
    setName(trade.name)
    setDescription(trade.description || '')
    setDurationMonths(trade.duration_months)
    setTuitionFee(trade.tuition_fee || 0)
    setPrerequisites(
      Array.isArray(trade.prerequisites)
        ? trade.prerequisites.join(', ')
        : typeof trade.prerequisites === 'string'
        ? trade.prerequisites
        : ''
    )
    setCurriculum(
      trade.curriculum && typeof trade.curriculum === 'object'
        ? JSON.stringify(trade.curriculum)
        : trade.curriculum || ''
    )
    setIsActive(trade.is_active)
    setMessage(null)
    setError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormLoading(true)
    setMessage(null)
    setError(null)

    try {
      const payload = {
        category_code: categoryCode,
        code: tradeCode,
        name,
        description,
        duration_months: durationMonths,
        tuition_fee: tuitionFee,
        prerequisites: prerequisites
          ? prerequisites.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        curriculum: curriculum ? { overview: curriculum } : {},
      }

      if (selectedTrade) {
        await apiClient.updateTrade({
          trade_id: selectedTrade.id,
          name,
          description,
          duration_months: durationMonths,
          tuition_fee: tuitionFee,
          prerequisites: payload.prerequisites,
          curriculum: payload.curriculum,
          is_active: isActive,
        })
        setMessage('Trade updated successfully.')
      } else {
        await apiClient.createTrade(payload)
        setMessage('Trade created successfully.')
      }

      setIsModalOpen(false)
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Unable to save trade.')
    } finally {
      setFormLoading(false)
    }
  }

  const activeCount = trades.filter((trade) => trade.is_active).length
  const inactiveCount = trades.length - activeCount

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
          <h2 className="text-2xl font-bold text-slate-900">Trade Catalog</h2>
          <p className="text-sm text-slate-600">Manage skill pathways and review program offerings across the training portfolio.</p>
        </div>
        <Button onClick={openCreateModal}>New trade</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{trades.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      {message ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{message}</div>
      ) : null}
      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Skills and Pathways</CardTitle>
          <CardDescription>View the available trades and open a row to edit an existing record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{trade.code}</td>
                    <td className="py-4 px-4">{trade.name}</td>
                    <td className="py-4 px-4">{trade.category_name || '—'}</td>
                    <td className="py-4 px-4">{trade.duration_months} months</td>
                    <td className="py-4 px-4">
                      <Badge variant={trade.is_active ? 'default' : 'outline'}>
                        {trade.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(trade)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        title={selectedTrade ? 'Edit trade' : 'Create trade'}
        description={selectedTrade ? 'Update an existing trade offering.' : 'Add a new trade to the catalog.'}
        onClose={() => setIsModalOpen(false)}
      >
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              required={!selectedTrade}
              disabled={!!selectedTrade}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.code}>
                  {category.name} ({category.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Trade code</label>
            <input
              value={tradeCode}
              onChange={(e) => setTradeCode(e.target.value)}
              required={!selectedTrade}
              disabled={!!selectedTrade}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Duration (months)</label>
            <input
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              required
              min={1}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tuition fee</label>
            <input
              type="number"
              value={tuitionFee}
              onChange={(e) => setTuitionFee(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Prerequisites</label>
            <input
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              placeholder="Separate multiple items with commas"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Curriculum summary</label>
            <textarea
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1a6b53]"
              />
              Active
            </label>
          </div>
          <div className="lg:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : selectedTrade ? 'Update trade' : 'Create trade'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
