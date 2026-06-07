'use client'

import { FormEvent, useEffect, useState } from 'react'
import { apiClient } from '@/src/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'

interface AdminProgram {
  id: number
  title: string
  category: string
  description?: string
  image_url: string
  display_order: number
  is_active: boolean
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<AdminProgram | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)

  const loadPrograms = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.getAdminPrograms()
      setPrograms(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load programs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrograms()
  }, [])

  const resetForm = () => {
    setSelectedProgram(null)
    setTitle('')
    setCategory('')
    setImageUrl('')
    setDescription('')
    setDisplayOrder(1)
    setIsActive(true)
    setMessage(null)
    setError(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (program: AdminProgram) => {
    setSelectedProgram(program)
    setTitle(program.title)
    setCategory(program.category)
    setImageUrl(program.image_url)
    setDescription(program.description || '')
    setDisplayOrder(program.display_order)
    setIsActive(program.is_active)
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
      if (selectedProgram) {
        await apiClient.updateProgram({
          program_id: selectedProgram.id,
          title,
          category,
          image_url: imageUrl,
          description,
          display_order: displayOrder,
          is_active: isActive,
        })
        setMessage('Program updated successfully.')
      } else {
        await apiClient.createProgram({
          title,
          category,
          image_url: imageUrl,
          description,
          display_order: displayOrder,
          is_active: isActive,
        })
        setMessage('Program created successfully.')
      }
      setIsModalOpen(false)
      await loadPrograms()
    } catch (err: any) {
      setError(err.message || 'Unable to save the program.')
    } finally {
      setFormLoading(false)
    }
  }

  const activeCount = programs.filter((program) => program.is_active).length
  const inactiveCount = programs.length - activeCount

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
          <h2 className="text-2xl font-bold text-slate-900">Program Gallery</h2>
          <p className="text-sm text-slate-600">Manage featured programs and course pathways for the public catalog.</p>
        </div>
        <Button onClick={openCreateModal}>New program</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{programs.length}</p>
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
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>Review programs and open a card to edit its display details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{program.title}</td>
                    <td className="py-4 px-4">{program.category}</td>
                    <td className="py-4 px-4">{program.display_order}</td>
                    <td className="py-4 px-4">
                      <Badge variant={program.is_active ? 'default' : 'outline'}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(program)}>
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
        title={selectedProgram ? 'Edit program' : 'Create program'}
        description={selectedProgram ? 'Update the gallery card for public display.' : 'Add a new program to the gallery.'}
        onClose={() => setIsModalOpen(false)}
      >
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Display order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
              {formLoading ? 'Saving...' : selectedProgram ? 'Update program' : 'Create program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
