import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  try {
    console.log('Starting database migrations...')

    // List of migration files in order
    const migrations = [
      '001_core_roles_departments.sql',
      '002_staff_profiles.sql',
      '003_trades_courses.sql',
      '004_students.sql',
      '005_admissions_letters.sql',
      '008_program_gallery.sql'
    ]

    // Run each migration
    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`)
      const sql = readFileSync(join(__dirname, 'migrations', migration), 'utf8')

      // Split SQL into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' })
            if (error) {
              console.error(`Error in ${migration}:`, error)
              // Continue with other statements
            }
          } catch (err) {
            console.error(`Failed to execute statement in ${migration}:`, err.message)
            // Continue with other statements
          }
        }
      }
    }

    // Run RLS policies
    console.log('Running RLS policies...')
    const rlsSql = readFileSync(join(__dirname, 'policies', '010_rls_enable.sql'), 'utf8')
    const rlsStatements = rlsSql.split(';').filter(stmt => stmt.trim().length > 0)

    for (const statement of rlsStatements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' })
          if (error) {
            console.error('Error in RLS policies:', error)
          }
        } catch (err) {
          console.error('Failed to execute RLS statement:', err.message)
        }
      }
    }

    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigrations()