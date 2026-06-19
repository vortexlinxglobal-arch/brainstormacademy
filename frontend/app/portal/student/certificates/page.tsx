'use client'

import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function StudentCertificatesPage() {
  const certificates = [
    {
      id: 1,
      name: 'Advanced Nursing Science Completion',
      date: 'March 15, 2024',
      grade: 'Distinction',
      credential: 'CERT-2024-NURS-001',
    },
  ]

  return (
    <PortalSectionShell
      title="My Certificates"
      description="View and manage your earned credentials"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Earned Certificates ({certificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-3xl border border-slate-200 p-8 bg-gradient-to-br from-purple-50 to-slate-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{cert.name}</h3>
                        <p className="text-sm text-slate-700 mt-1">Credential ID: {cert.credential}</p>
                      </div>
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 mb-6">
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Issued Date</p>
                        <p className="mt-1 font-semibold text-slate-900">{cert.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Grade</p>
                        <p className="mt-1 font-semibold text-emerald-600">{cert.grade}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Status</p>
                        <p className="mt-1 font-semibold text-slate-900">Verified</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-700 mb-4">You haven't earned any certificates yet</p>
                <Link href="/portal/student/courses">
                  <Button>View Available Courses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">How certificates work:</span> Upon completing a course and achieving the minimum required grade, you
                will automatically receive a digital certificate.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Verification:</span> All certificates are digitally signed and can be verified by employers or
                educational institutions.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Sharing:</span> You can download your certificates as PDF or share them directly via email or
                LinkedIn.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
