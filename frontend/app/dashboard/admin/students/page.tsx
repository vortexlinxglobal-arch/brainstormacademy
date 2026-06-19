'use client'

import { FormEvent, useEffect, useState } from 'react'
import { apiClient } from '@/src/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'

interface AdminStudent {
  id: number
  registration_number: string
  first_name: string
  last_name: string
  enrollment_status: string
  created_at: string
  profiles?: {
    email: string
  }
  enrollments?: Array<{
    trades?: {
      name: string
      code: string
    }
  }>
}

interface TradeOption {
  id: number
  code: string
  name: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [trades, setTrades] = useState<TradeOption[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('male')
  const [tradeCode, setTradeCode] = useState('')
  const [contact, setContact] = useState('')
  const [guardianContact, setGuardianContact] = useState('')
  const [address, setAddress] = useState('')
  const [academicBackground, setAcademicBackground] = useState('')

  const [selectedStatus, setSelectedStatus] = useState('enrolled')
  const [selectedContact, setSelectedContact] = useState('')
  const [selectedGuardianContact, setSelectedGuardianContact] = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedAcademicBackground, setSelectedAcademicBackground] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [studentsResponse, tradesResponse] = await Promise.all([
        apiClient.getAdminStudents(),
        apiClient.getTrades(),
      ])
      setStudents(studentsResponse.data || [])
      setTrades(tradesResponse.data || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load student data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateModal = () => {
    setMessage(null)
    setError(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setDateOfBirth('')
    setGender('male')
    setTradeCode('')
    setContact('')
    setGuardianContact('')
    setAddress('')
    setAcademicBackground('')
    setIsCreateOpen(true)
  }

  const openEditModal = (student: AdminStudent) => {
    setMessage(null)
    setError(null)
    setSelectedStudent(student)
    setSelectedStatus(student.enrollment_status)
    setSelectedContact('')
    setSelectedGuardianContact('')
    setSelectedAddress('')
    setSelectedAcademicBackground('')
    setIsEditOpen(true)
  }

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormLoading(true)
    setMessage(null)
    setError(null)

    try {
      await apiClient.registerStudent({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender,
        contact,
        guardian_contact: guardianContact,
        address: address ? { details: address } : undefined,
        academic_background: academicBackground ? { notes: academicBackground } : undefined,
        trade_code: tradeCode,
      })
      setMessage('Student created successfully.')
      setIsCreateOpen(false)
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Unable to create student.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedStudent) return

    setFormLoading(true)
    setMessage(null)
    setError(null)

    try {
      await apiClient.updateAdminStudent({
        student_id: selectedStudent.id,
        enrollment_status: selectedStatus,
        contact: selectedContact || undefined,
        guardian_contact: selectedGuardianContact || undefined,
        address: selectedAddress ? { details: selectedAddress } : undefined,
        academic_background: selectedAcademicBackground ? { notes: selectedAcademicBackground } : undefined,
      })
      setMessage('Student profile updated successfully.')
      setSelectedStudent(null)
      setIsEditOpen(false)
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Unable to update student.')
    } finally {
      setFormLoading(false)
    }
  }

  const enrolledCount = students.filter((student) => student.enrollment_status === 'enrolled').length
  const pendingCount = students.filter((student) => student.enrollment_status === 'pending').length

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
          <h2 className="text-2xl font-bold text-slate-900">Student Management</h2>
          <p className="text-sm text-slate-600">Review learners, enroll new students, and update profiles from one place.</p>
        </div>
        <Button onClick={openCreateModal}>New student</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{enrolledCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{pendingCount}</p>
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
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>Browse records and open a student profile to update enrollment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Trade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const trade = student.enrollments?.[0]?.trades
                  return (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-medium text-slate-900">{student.first_name} {student.last_name}</td>
                      <td className="py-4 px-4">{student.profiles?.email || '—'}</td>
                      <td className="py-4 px-4">{trade ? `${trade.name} (${trade.code})` : 'No trade assigned'}</td>
                      <td className="py-4 px-4">
                        <Badge variant={student.enrollment_status === 'enrolled' ? 'default' : 'outline'}>
                          {student.enrollment_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{new Date(student.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(student)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={isCreateOpen}
        title="Create new student"
        description="Fill in the student details and enroll them into a trade program."
        onClose={() => setIsCreateOpen(false)}
      >
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleCreateStudent}>
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date of birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Trade program</label>
            <select
              value={tradeCode}
              onChange={(e) => setTradeCode(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="">Select a program</option>
              {trades.map((trade) => (
                <option key={trade.id} value={trade.code}>
                  {trade.name} ({trade.code})
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Contact</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Guardian contact</label>
            <input
              value={guardianContact}
              onChange={(e) => setGuardianContact(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Academic background</label>
            <textarea
              value={academicBackground}
              onChange={(e) => setAcademicBackground(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create student'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isEditOpen}
        title="Update student profile"
        description="Adjust enrollment status and profile details for this learner."
        onClose={() => setIsEditOpen(false)}
      >
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleUpdateStudent}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="pending">Pending</option>
              <option value="enrolled">Enrolled</option>
              <option value="suspended">Suspended</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Contact</label>
            <input
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Guardian contact</label>
            <input
              value={selectedGuardianContact}
              onChange={(e) => setSelectedGuardianContact(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <textarea
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Academic background</label>
            <textarea
              value={selectedAcademicBackground}
              onChange={(e) => setSelectedAcademicBackground(e.target.value)}
              className="mt-2 w-full min-h-[96px] rounded-2xl border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
          <div className="lg:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Updating...' : 'Update student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
