export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  // Add table/view definitions here if needed.
  // This stub is intentionally minimal for local Supabase startup.
}
