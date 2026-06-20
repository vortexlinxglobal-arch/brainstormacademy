import { NextResponse } from 'next/server'
import { clearSessionCookies } from '../_lib'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST() {
  const response = NextResponse.json({ data: { success: true } })
  clearSessionCookies(response)
  return response
}
