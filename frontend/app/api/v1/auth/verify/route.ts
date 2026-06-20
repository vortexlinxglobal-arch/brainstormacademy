import { NextRequest, NextResponse } from 'next/server'
import { getBearerToken, getSupabaseAdmin, json, setSessionCookies } from '../_lib'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const accessToken = getBearerToken(request)

    if (accessToken) {
      const { data, error } = await supabase.auth.getUser(accessToken)
      if (!error && data.user) {
        return json({ data: { user: data.user } })
      }
    }

    const refreshToken = request.cookies.get('sb_refresh_token')?.value
    if (!refreshToken) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    if (error || !data.session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = NextResponse.json({ data: { user: data.session.user } })
    setSessionCookies(response, data.session)
    return response
  } catch (error: any) {
    console.error('Verify route error:', error)
    return json({ error: error?.message || 'Unable to verify session.' }, { status: 500 })
  }
}
