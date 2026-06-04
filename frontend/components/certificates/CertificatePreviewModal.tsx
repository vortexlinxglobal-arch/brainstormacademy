'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, X, ShieldCheck } from 'lucide-react'

export interface CertificatePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  courseTitle: string
  issuedDate: string
  certificateId: string
  institution?: string
}

export function CertificatePreviewModal({
  open,
  onOpenChange,
  studentName,
  courseTitle,
  issuedDate,
  certificateId,
  institution = 'Brainstorm Academy Skills',
}: CertificatePreviewModalProps) {
  const qrPattern = useMemo(() => {
    return Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 6 }, (_, col) => ({ row, col, filled: (row + col) % 2 === 0 }))
    )
  }, [])

  const downloadCertificate = () => {
    // Create SVG certificate
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="certBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a6b53;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#10B981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D4AF37;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="overlay" cx="0%" cy="0%" r="100%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.18" />
            <stop offset="22%" style="stop-color:#FFFFFF;stop-opacity:0" />
          </radialGradient>
        </defs>

        <!-- Background -->
        <rect width="800" height="600" fill="url(#certBg)" rx="40" ry="40"/>
        <rect width="800" height="600" fill="url(#overlay)" rx="40" ry="40"/>

        <!-- Certificate Content -->
        <g transform="translate(40, 40)">
          <!-- Header -->
          <text x="0" y="40" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" opacity="0.8" text-transform="uppercase" letter-spacing="0.3em">CERTIFICATE OF COMPLETION</text>
          <text x="0" y="80" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#FFFFFF">${courseTitle}</text>
          <text x="0" y="120" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFF" opacity="0.9">This certifies that ${studentName} has completed the full practical course and demonstrated core vocational competency required for certification.</text>

          <!-- Details Grid -->
          <g transform="translate(0, 160)">
            <!-- Issued Date -->
            <rect x="0" y="0" width="180" height="60" fill="#FFFFFF" opacity="0.1" rx="15" ry="15"/>
            <text x="15" y="25" font-family="Arial, sans-serif" font-size="10" fill="#FFFFFF" opacity="0.8" text-transform="uppercase" letter-spacing="0.3em">ISSUED</text>
            <text x="15" y="50" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">${issuedDate}</text>

            <!-- Verified By -->
            <rect x="200" y="0" width="180" height="60" fill="#FFFFFF" opacity="0.1" rx="15" ry="15"/>
            <text x="215" y="25" font-family="Arial, sans-serif" font-size="10" fill="#FFFFFF" opacity="0.8" text-transform="uppercase" letter-spacing="0.3em">VERIFIED BY</text>
            <text x="215" y="50" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">${institution}</text>
          </g>

          <!-- Signatures and QR -->
          <g transform="translate(0, 240)">
            <!-- Signatures -->
            <rect x="0" y="0" width="400" height="120" fill="#FFFFFF" opacity="0.1" rx="20" ry="20"/>
            <text x="20" y="30" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" opacity="0.75" text-transform="uppercase" letter-spacing="0.3em">SIGNATURES</text>

            <!-- Registrar -->
            <line x1="20" y1="45" x2="180" y2="45" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1"/>
            <text x="20" y="65" font-family="Arial, sans-serif" font-size="12" fill="#FFFFFF" opacity="0.8">Registrar</text>
            <text x="20" y="85" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Mrs. A. Chukwu</text>

            <!-- Programme Lead -->
            <line x1="220" y1="45" x2="380" y2="45" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1"/>
            <text x="220" y="65" font-family="Arial, sans-serif" font-size="12" fill="#FFFFFF" opacity="0.8">Programme Lead</text>
            <text x="220" y="85" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Mr. J. Okafor</text>

            <!-- QR Code -->
            <g transform="translate(450, 0)">
              <rect x="0" y="0" width="120" height="120" fill="#FFFFFF" opacity="0.1" rx="15" ry="15"/>
              <g transform="translate(15, 15)">
                ${qrPattern.flat().map(cell => 
                  cell.filled ? `<rect x="${cell.col * 15}" y="${cell.row * 15}" width="15" height="15" fill="#FFFFFF"/>` : ''
                ).join('')}
              </g>
              <text x="60" y="145" font-family="Arial, sans-serif" font-size="10" fill="#FFFFFF" opacity="0.7" text-transform="uppercase" letter-spacing="0.3em" text-anchor="middle">QR VERIFICATION</text>
            </g>
          </g>

          <!-- Certificate ID -->
          <text x="0" y="420" font-family="Arial, sans-serif" font-size="12" fill="#FFFFFF" opacity="0.8">Certificate ID: ${certificateId}</text>

          <!-- Badges -->
          <g transform="translate(0, 440)">
            <rect x="0" y="0" width="120" height="30" fill="#1a6b53" rx="15" ry="15"/>
            <text x="60" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">NSQ Certified</text>

            <rect x="130" y="0" width="140" height="30" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" rx="15" ry="15"/>
            <text x="200" y="20" font-family="Arial, sans-serif" font-size="12" fill="#FFFFFF" text-anchor="middle">NBTE Accredited</text>
          </g>
        </g>
      </svg>
    `.trim()

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${studentName.replace(/\s+/g, '-')}-${courseTitle.replace(/\s+/g, '-')}-certificate.svg`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onClick={() => onOpenChange(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Certificate preview</p>
            <h2 id="certificate-title" className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Official achievement certificate</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => onOpenChange(false)}
            aria-label="Close certificate preview"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div
          className="grid gap-6 p-6 lg:grid-cols-[1fr_0.95fr]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <p className="font-semibold uppercase tracking-[0.3em]">Certified</p>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Awarded to</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{studentName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">For course</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{courseTitle}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Date issued</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{issuedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Certificate ID</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{certificateId}</p>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Institution</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{institution}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="default" className="bg-[#1a6b53] text-white">
                NSQ Certified
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                NBTE Accredited
              </Badge>
            </div>

            <Button
              variant="default"
              size="lg"
              className="mt-8 w-full gap-2"
              onClick={downloadCertificate}
            >
              <Download className="h-4 w-4" />
              Download certificate
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#1a6b53] via-[#10B981] to-[#D4AF37] p-8 text-white shadow-xl dark:border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_22%)]" />
            <div className="relative space-y-5">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Certificate of completion</p>
                <h3 className="mt-4 text-3xl font-bold">{courseTitle}</h3>
                <p className="mt-2 text-sm text-white/90">This certifies that {studentName} has completed the full practical course and demonstrated core vocational competency required for certification.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/80">Issued</p>
                  <p className="mt-2 text-lg font-semibold">{issuedDate}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/80">Verified by</p>
                  <p className="mt-2 text-lg font-semibold">Brainstorm Academy</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                <div className="space-y-3 rounded-[1.75rem] bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/75">Signatures</p>
                  <div className="space-y-3">
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-sm text-white/80">Registrar</p>
                      <p className="text-base font-semibold">Mrs. A. Chukwu</p>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-sm text-white/80">Programme Lead</p>
                      <p className="text-base font-semibold">Mr. J. Okafor</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-4 text-center">
                  <div className="mx-auto mb-4 grid h-32 w-32 grid-cols-6 gap-0.5 rounded-xl bg-slate-950 p-1 text-slate-950">
                    {qrPattern.flat().map((cell) => (
                      <span
                        key={`${cell.row}-${cell.col}`}
                        className={`block h-3 w-3 ${cell.filled ? 'bg-white' : 'bg-slate-950'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">QR verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
