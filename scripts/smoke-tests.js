const routes = [
  '/',
  '/signin',
  '/signup',
  '/portal',
  '/portal/admin',
  '/portal/admin/staff/new'
]

const base = process.env.BASE_URL || 'http://localhost:3000'

async function run() {
  let failed = 0
  for (const route of routes) {
    const url = base + route
    try {
      const res = await fetch(url, { redirect: 'manual' })
      const status = res.status
      const location = res.headers.get('location')
      if (status >= 200 && status < 400) {
        console.log(`${route}: ${status}${location ? ' -> ' + location : ''}`)
      } else {
        console.error(`${route}: FAILED ${status}`)
        failed++
      }
    } catch (err) {
      console.error(`${route}: ERROR ${err.message}`)
      failed++
    }
  }

  if (failed > 0) {
    console.error(`${failed} route(s) failed`)
    process.exit(1)
  }
  console.log('All smoke routes OK')
}

run()
