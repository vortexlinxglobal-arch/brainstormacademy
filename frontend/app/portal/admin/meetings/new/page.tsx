'use client'

import { useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { apiClient } from '@/src/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarPlus, Clock, Users, MapPin } from 'lucide-react'

export default function NewMeetingPage() {
  const [topic, setTopic] = useState('')
  const [agenda, setAgenda] = useState('')
  const [date, setDate] = useState('2026-06-12')
  const [time, setTime] = useState('09:00')
  const [location, setLocation] = useState('Boardroom')
  const [participants, setParticipants] = useState('Management, Admin, Training')
  const [minutes, setMinutes] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const saveMeeting = async () => {
    if (!topic || !date || !location || !participants) {
      alert('Please provide topic, date, location, and participants.')
      return
    }

    setSaving(true)
    try {
      await apiClient.createMeeting({
        topic,
        agenda,
        scheduled_date: date,
        scheduled_time: time,
        location,
        participants,
        minutes,
      })
      setSuccessMessage('Meeting successfully scheduled.')
      setTopic('')
      setAgenda('')
      setDate('2026-06-12')
      setTime('09:00')
      setLocation('Boardroom')
      setParticipants('Management, Admin, Training')
      setMinutes('')
    } catch (error) {
      console.error('Failed to create meeting:', error)
      alert('Unable to save meeting. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PortalSectionShell
      title="Schedule a Meeting"
      description="Create new meetings with agenda, participants, and location details."
      allowedRoles={['Admin', 'Manager', 'Staff']}
    >
      <div className="space-y-8">
        {successMessage && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {successMessage}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Meeting details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Topic
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Enter meeting topic"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Time
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-800">
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location or room"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                Participants
                <textarea
                  value={participants}
                  onChange={(event) => setParticipants(event.target.value)}
                  rows={4}
                  placeholder="Add attendee groups or names"
                  className="min-h-[140px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                Agenda
                <textarea
                  value={agenda}
                  onChange={(event) => setAgenda(event.target.value)}
                  rows={4}
                  placeholder="Meeting agenda or objectives"
                  className="min-h-[140px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="lg:col-span-2 flex flex-col gap-2 text-sm text-slate-800">
                Minutes
                <textarea
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  rows={4}
                  placeholder="Record meeting minutes or decisions"
                  className="min-h-[140px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={saveMeeting} disabled={saving}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Save meeting
              </Button>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Schedule reminder
              </Button>
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Add location
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-slate-700">Focus agenda</p>
            <p className="mt-3 text-slate-900">Keep meetings short while capturing decisions.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-700">Record minutes</p>
            <p className="mt-3 text-slate-600">Use the minutes template after the meeting.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-700">Invite staff</p>
            <p className="mt-3 text-slate-600">Notify trainers and management teams quickly.</p>
          </div>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
