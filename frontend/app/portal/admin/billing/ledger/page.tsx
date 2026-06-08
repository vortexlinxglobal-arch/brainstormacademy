'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, DollarSign, FileText, Search } from 'lucide-react'

interface PaymentRecord {
  id: number
  student_id: number
  amount: number
  payment_method: string
  status: string
  payment_date: string
  notes?: string
  transaction_id?: string
  students?: {
    first_name: string
    last_name: string
  }
  enrollments?: {
    trade?: {
      name: string
    }
  }
}

export default function BillingLedgerPage() {
  const [query, setQuery] = useState('')
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [studentEmail, setStudentEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadPayments() {
      setLoading(true)
      try {
        const result = await apiClient.getAdminPayments()
        setPayments(result ?? [])
      } catch (error) {
        console.error('Failed to load payments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  const handleCreatePayment = async () => {
    if (!studentEmail || !amount || !paymentMethod) {
      alert('Student email, amount, and payment method are required.')
      return
    }

    setSaving(true)
    try {
      const payment = await apiClient.createPayment({
        student_email: studentEmail,
        amount: Number(amount),
        payment_method: paymentMethod,
        notes,
      })
      setPayments((current) => [payment, ...current])
      setStudentEmail('')
      setAmount('')
      setPaymentMethod('cash')
      setNotes('')
      alert('Payment recorded successfully.')
    } catch (error) {
      console.error('Failed to record payment:', error)
      alert('Unable to save payment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = payments.filter(
    (entry) =>
      entry.students?.first_name?.toLowerCase().includes(query.toLowerCase()) ||
      entry.students?.last_name?.toLowerCase().includes(query.toLowerCase()) ||
      entry.enrollments?.trade?.name?.toLowerCase().includes(query.toLowerCase()) ||
      entry.status.toLowerCase().includes(query.toLowerCase()),
  )

  const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  const openInvoices = payments.filter((payment) => payment.status !== 'completed').length
  const receiptsIssued = payments.filter((payment) => payment.status === 'completed').length

  return (
    <PortalSectionShell title="Billing Ledger" description="Review payments, invoices, and receipts for all enrollments." allowedRoles={['Admin', 'Manager', 'Staff']}>
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">₦{totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Open invoices</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{openInvoices}</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Receipts issued</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{receiptsIssued}</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Student email
                <input
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                  placeholder="student@example.com"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Method
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="online">Online</option>
                </select>
              </label>
              <div className="flex items-end">
                <Button onClick={handleCreatePayment} disabled={saving}>
                  Create payment
                </Button>
              </div>
            </div>
            <label className="mt-4 flex flex-col gap-2 text-sm text-slate-800">
              Notes
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional payment details"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search student, course, status"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Generate invoice</Button>
                <Button variant="outline">Export ledger</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Course</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                        Loading payments...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                        No payment records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-4 text-slate-900">
                          {entry.students ? `${entry.students.first_name} ${entry.students.last_name}` : `Student #${entry.student_id}`}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {entry.enrollments?.trade?.name || 'General payment'}
                        </td>
                        <td className="px-4 py-4 text-slate-700">₦{Number(entry.amount).toFixed(2)}</td>
                        <td className="px-4 py-4 text-slate-700">{entry.status}</td>
                        <td className="px-4 py-4 text-slate-700">{new Date(entry.payment_date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
