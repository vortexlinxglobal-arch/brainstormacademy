'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { apiClient } from '@/src/api'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    if (!name.trim() || !email.trim() || !subject.trim()) {
      setStatus({ type: 'error', text: 'Please provide your name, email, and what you are interested in.' })
      return
    }

    setLoading(true)
    try {
      await apiClient.submitAdmissionsApplication({
        applicant_name: name.trim(),
        applicant_email: email.trim(),
        phone: phone.trim() || undefined,
        trade_interest: subject.trim(),
        motivation_statement: message.trim() || undefined,
      })

      setStatus({ type: 'success', text: 'Thank you! Your inquiry has been sent. Our admissions team will be in touch soon.' })
      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
    } catch (error: any) {
      setStatus({
        type: 'error',
        text:
          error?.message?.includes('Unable to connect') || error?.message?.includes('Network error')
            ? 'Unable to submit your inquiry. Please check your connection and try again.'
            : error?.message || 'Something went wrong while sending your inquiry.',
      })
      console.error('Admissions inquiry error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="bg-[#071410] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6 sm:space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#F6E2B3]">
                Contact Brainstorm Skills
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let's start a conversation about your next skill, certification, or career move.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
                Whether you are ready to enroll, need support with admissions, or want to partner with Brainstorm Skills, our team is here to provide fast guidance and helpful next steps.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-[#D4AF37]/20 transition hover:bg-[#b99223]"
                >
                  Explore Courses
                </Link>
                <Link
                  href="mailto:info@brainstormskills.com.ng"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Email Admissions
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Office Hours</p>
                  <div className="mt-4 space-y-3 rounded-3xl bg-[#0c2720] p-5 text-sm leading-7 text-slate-200">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Location</p>
                  <p className="mt-3 text-lg font-semibold text-white">No. 22 Ni'ma Road, Hayin Danmani, Kaduna</p>
                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="mt-4 inline-flex text-sm font-semibold text-[#D4AF37] hover:text-[#b99223]"
                  >
                    Open in Maps →
                  </Link>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Reach us</p>
                  <div className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
                    <p>Phone: <a href="tel:+2349018837909" className="text-white hover:text-[#D4AF37]">+234 901 883 7909</a></p>
                    <p>Email: <a href="mailto:info@brainstormskills.com.ng" className="text-white hover:text-[#D4AF37]">info@brainstormskills.com.ng</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Send us a message</h2>
            <p className="text-base leading-8 text-slate-700">
              Fill out the form below and our team will respond within 24 hours. Include your course interest, preferred start date, and any questions you have about admissions or financing.
            </p>

            {status ? (
              <div
                className={`rounded-3xl border px-5 py-4 text-sm font-semibold ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                {status.text}
              </div>
            ) : null}

            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Full name
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-[#1a6b53] focus:ring-[#1a6b53]/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Email address
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-[#1a6b53] focus:ring-[#1a6b53]/20"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Phone number
                  <input
                    type="tel"
                    placeholder="+234 901 883 7909"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-[#1a6b53] focus:ring-[#1a6b53]/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Subject
                  <input
                    type="text"
                    placeholder="What would you like to discuss?"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-[#1a6b53] focus:ring-[#1a6b53]/20"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-700">
                Message
                <textarea
                  rows={5}
                  placeholder="Tell us about your questions or course interests"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:border-[#1a6b53] focus:ring-[#1a6b53]/20"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1a6b53] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-[#1a6b53]/20 transition hover:bg-[#0f6f44] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
              <h3 className="text-xl font-semibold text-slate-900">How can we help?</h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Course Inquiry</p>
                  <p>Learn more about available NSQ programs and schedules.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Admission Support</p>
                  <p>Get guidance through admissions, registration, and payments.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Partnerships</p>
                  <p>Discuss collaboration opportunities with our training center.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Career Support</p>
                  <p>Ask about placement services, internships, and graduate support.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
              <h3 className="text-xl font-semibold text-slate-900">Need answers faster?</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                You can also reach us by phone, email, or visit our campus in Kaduna for a guided tour and registration support.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Phone</p>
                <a href="tel:+2349018837909" className="text-[#1a6b53] hover:text-[#134c35]">+234 901 883 7909</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
