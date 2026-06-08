'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Button } from '@/components/ui/button'

export default function AddStaffPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [departmentCode, setDepartmentCode] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!email || !fullName || !phone || !categoryCode) {
      setMessage({ type: 'error', text: 'Email, full name, phone, and category code are required.' })
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.registerStaff({
        email,
        password: phone,
        full_name: fullName,
        category_code: categoryCode,
        department_code: departmentCode,
        bio,
        specialty,
      })

      setMessage({ type: 'success', text: 'Staff account created successfully. Login credentials have been set to the staff phone number.' })
      setEmail('')
      setFullName('')
      setPhone('')
      setCategoryCode('')
      setDepartmentCode('')
      setSpecialty('')
      setBio('')

      // Optional redirect after success
      setTimeout(() => {
        router.push('/portal/admin/staff')
      }, 1200)
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Unable to create staff account.' })
      console.error('Staff registration error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortalSectionShell
      title="Create Staff Account"
      description="Provision staff access with email and phone-based login credentials."
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
        <div className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Staff onboarding</p>
          <h2 className="text-2xl font-semibold text-slate-900">Provision a new staff user</h2>
          <p className="text-sm text-slate-600">
            Set up a staff account using the staff member&apos;s email and phone number. The phone number is also used as the initial password.
          </p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Staff email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Full name</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Phone number</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Staff category code</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="text"
                value={categoryCode}
                onChange={(event) => setCategoryCode(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Department code (optional)</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="text"
                value={departmentCode}
                onChange={(event) => setDepartmentCode(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Specialty (optional)</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="text"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Bio / notes</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </label>

          {message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                message.type === 'error'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Creating staff account…' : 'Create staff account'}
            </Button>
          </div>
        </form>
      </div>
    </PortalSectionShell>
  )
}
