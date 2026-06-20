import { NextResponse } from 'next/server'
import { getSupabaseAdmin, json, setSessionCookies } from '../_lib'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      return json({ error: error?.message || 'Invalid email or password.' }, { status: 401 })
    }

    const response = NextResponse.json({
      data: {
        user: data.user,
        session: data.session,
      },
    })
    setSessionCookies(response, data.session)
    return response
  } catch (error: any) {
    console.error('Signin route error:', error)
    return json({ error: error?.message || 'Signin failed.' }, { status: 500 })
  }
}
