import { createClient } from '@supabase/supabase-js'

const fallbackTrades = [
  { id: 1, code: 'WEB', name: 'Web Development' },
  { id: 2, code: 'DS', name: 'Data Science' },
  { id: 3, code: 'ELEC', name: 'Electrical Installation' },
  { id: 4, code: 'PLUMB', name: 'Plumbing' },
  { id: 5, code: 'BM', name: 'Business Management' },
  { id: 6, code: 'GD', name: 'Graphic Design' },
  { id: 7, code: 'CATER', name: 'Catering & Hospitality' },
]

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return Response.json({ data: fallbackTrades })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase
      .from('trades')
      .select('id, code, name')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.warn('Unable to load trades from Supabase:', error)
      return Response.json({ data: fallbackTrades })
    }

    return Response.json({ data: data?.length ? data : fallbackTrades })
  } catch (error) {
    console.warn('Unable to load trades:', error)
    return Response.json({ data: fallbackTrades })
  }
}
