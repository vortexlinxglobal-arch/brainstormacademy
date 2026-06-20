import { createClient } from '@supabase/supabase-js'
import type { NextRequest, NextResponse } from 'next/server'

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase server auth is not configured.')
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function setSessionCookies(response: NextResponse, session: any) {
  if (!session?.access_token || !session?.refresh_token) return

  response.cookies.set('sb_access_token', session.access_token, {
    ...cookieOptions,
    maxAge: session.expires_in ?? 60 * 60,
  })
  response.cookies.set('sb_refresh_token', session.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set('sb_access_token', '', { ...cookieOptions, maxAge: 0 })
  response.cookies.set('sb_refresh_token', '', { ...cookieOptions, maxAge: 0 })
}

export function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7)
  }

  return request.cookies.get('sb_access_token')?.value ?? null
}
