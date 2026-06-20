import { NextRequest } from 'next/server'
import { getBearerToken, getSupabaseAdmin, json } from '../auth/_lib'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const accessToken = getBearerToken(request)

    if (!accessToken) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userResult, error: userError } = await supabase.auth.getUser(accessToken)
    const user = userResult.user

    if (userError || !user) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return json({ error: profileError.message }, { status: 500 })
    }

    if (existingProfile) {
      return json({ data: existingProfile })
    }

    const metadata = user.user_metadata ?? {}
    const fullName = metadata.full_name || user.email?.split('@')[0] || 'Portal User'
    const role = metadata.role || 'student'

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role,
        is_active: true,
      })
      .select('*')
      .maybeSingle()

    if (createError) {
      return json({ error: createError.message }, { status: 500 })
    }

    return json({ data: createdProfile })
  } catch (error: any) {
    console.error('Profile route error:', error)
    return json({ error: error?.message || 'Unable to load profile.' }, { status: 500 })
  }
}
