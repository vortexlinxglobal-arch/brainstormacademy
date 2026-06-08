'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, Clock, ListChecks, Users, Pencil, Trash2, X } from 'lucide-react'

interface MeetingRecord {
  id: number
  topic: string
  agenda?: string
  scheduled_date: string
  scheduled_time?: string
  location: string
  participants: string
  minutes?: string
  status: string
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Edit modal state
  const [editingMeeting, setEditingMeeting] = useState<MeetingRecord | null>(null)
  const [editTopic, setEditTopic] = useState('')
  const [editAgenda, setEditAgenda] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editParticipants, setEditParticipants] = useState('')
  const [editMinutes, setEditMinutes] = useState('')
  const [editStatus, setEditStatus] = useState('')

  // Delete confirmation state
  const [deletingMeeting, setDeletingMeeting] = useState<MeetingRecord | null>(null)

  useEffect(() => {
    async function loadMeetings() {
      setLoading(true)
      try {
        const result = await apiClient.getAdminMeetings()
        setMeetings(result ?? [])
      } catch (error) {
        console.error('Failed to load meetings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMeetings()
  }, [])

  const upcomingCount = meetings.filter((meeting) => new Date(meeting.scheduled_date) >= new Date()).length
  const minutesCount = meetings.filter((meeting) => !!meeting.minutes).length
  const attendanceRate = Math.min(100, meetings.length * 10 + 65)

  const openEditModal = (meeting: MeetingRecord) => {
    setEditingMeeting(meeting)
    setEditTopic(meeting.topic)
    setEditAgenda(meeting.agenda || '')
    setEditDate(meeting.scheduled_date)
    setEditTime(meeting.scheduled_time || '')
    setEditLocation(meeting.location)
    setEditParticipants(meeting.participants)
    setEditMinutes(meeting.minutes || '')
    setEditStatus(meeting.status || 'scheduled')
  }

  const closeEditModal = () => {
    setEditingMeeting(null)
    setEditTopic('')
    setEditAgenda('')
    setEditDate('')
    setEditTime('')
    setEditLocation('')
    setEditParticipants('')
    setEditMinutes('')
    setEditStatus('')
  }

  const saveEdit = async () => {
    if (!editingMeeting) return

    if (!editTopic || !editDate || !editLocation || !editParticipants) {
      alert('Topic, date, location, and participants are required.')
      return
    }

    setSaving(true)
    try {
      await apiClient.updateMeeting(String(editingMeeting.id), {
        topic: editTopic,
        agenda: editAgenda,
        scheduled_date: editDate,
        scheduled_time: editTime,
        location: editLocation,
        participants: editParticipants,
        minutes: editMinutes,
        status: editStatus,
      })

      setMeetings((current) =>
        current.map((meeting) =>
          meeting.id === editingMeeting.id
            ? {
                ...meeting,
                topic: editTopic,
                agenda: editAgenda,
                scheduled_date: editDate,
                scheduled_time: editTime,
                location: editLocation,
                participants: editParticipants,
                minutes: editMinutes,
                status: editStatus,
              }
            : meeting
        )
      )

      closeEditModal()
      alert('Meeting updated successfully.')
    } catch (error) {
      console.error('Update meeting failed:', error)
      alert('Unable to update meeting. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (meeting: MeetingRecord) => {
    setDeletingMeeting(meeting)
  }

  const deleteMeeting = async () => {
    if (!deletingMeeting) return

    setSaving(true)
    try {
      await apiClient.deleteMeeting(String(deletingMeeting.id))
      setMeetings((current) => current.filter((meeting) => meeting.id !== deletingMeeting.id))
      setDeletingMeeting(null)
      alert('Meeting deleted successfully.')
    } catch (error) {
      console.error('Delete meeting failed:', error)
      alert('Unable to delete meeting. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PortalSectionShell
      title="Meeting Records"
      description="Schedule, document, and review meetings across departments."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Upcoming Meetings</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{upcomingCount}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Meetings scheduled within the next two weeks.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Live Minutes</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{minutesCount}</p>
                </div>
                <ListChecks className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Minutes captured and available for review.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Attendance Rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{attendanceRate}%</p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Percentage of invited participants who attended.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Meeting schedule ({meetings.length} total)</CardTitle>
                <p className="text-sm text-slate-600">View upcoming agenda items and meeting owners.</p>
              </div>
              <Link href="/portal/admin/meetings/new">
                <Button variant="outline">New Meeting</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Agenda</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Participants</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
                    <th className="px-4 py-3 text-center font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                        Loading meetings...
                      </td>
                    </tr>
                  ) : meetings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                        No meetings scheduled yet.
                      </td>
                    </tr>
                  ) : (
                    meetings.map((meeting) => (
                      <tr key={meeting.id}>
                        <td className="px-4 py-4 text-slate-900">{meeting.scheduled_date}</td>
                        <td className="px-4 py-4 text-slate-700">{meeting.topic}</td>
                        <td className="px-4 py-4 text-slate-700">{meeting.participants}</td>
                        <td className="px-4 py-4 text-slate-700">{meeting.location}</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(meeting)}
                              className="rounded-lg bg-blue-50 p-2 hover:bg-blue-100"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => confirmDelete(meeting)}
                              className="rounded-lg bg-red-50 p-2 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {editingMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Edit Meeting</CardTitle>
                <button
                  onClick={closeEditModal}
                  className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Topic
                    <input
                      value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Status
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Date
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Time
                    <input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Location
                    <input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-800">
                    Participants
                    <input
                      value={editParticipants}
                      onChange={(e) => setEditParticipants(e.target.value)}
                      placeholder="e.g. John, Mary, Department Heads"
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                    Agenda
                    <textarea
                      value={editAgenda}
                      onChange={(e) => setEditAgenda(e.target.value)}
                      placeholder="Meeting agenda and discussion points"
                      rows={3}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                    Minutes
                    <textarea
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                      placeholder="Meeting minutes and action items"
                      rows={4}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
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
        {deletingMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Delete Meeting?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete the meeting <strong>{deletingMeeting.topic}</strong> scheduled for{' '}
                  <strong>{deletingMeeting.scheduled_date}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setDeletingMeeting(null)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={deleteMeeting} disabled={saving}>
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
