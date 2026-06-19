import { createSupabaseServerClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Supabase SSR Test</h1>
        <p className="text-slate-500">Supabase env vars not set; skipping SSR test.</p>
      </main>
    )
  }

  const supabase = await createSupabaseServerClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .limit(10)

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Supabase SSR Test</h1>
        <p className="text-red-600">Error: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Supabase SSR Profiles</h1>
      <ul className="mt-4 list-disc pl-6">
        {profiles?.length ? (
          profiles.map((profile: any) => (
            <li key={profile.id}>
              {profile.email ?? 'No email'} — {profile.role ?? 'no role'}
            </li>
          ))
        ) : (
          <li className="text-slate-700">No profiles found</li>
        )}
      </ul>
    </main>
  )
}
