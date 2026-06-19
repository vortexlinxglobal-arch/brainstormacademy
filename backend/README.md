# Backend API

This backend is a small Express server that exposes a `v1` API surface aligned with the frontend `apiClient` contract.

## Start locally

1. Copy `backend/.env.example` to `backend/.env`
2. Replace the placeholders with your Supabase values:
   - `SUPABASE_URL`: your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: the service role key from Supabase
   - `NEXT_PUBLIC_BACKEND_URL`: `http://localhost:4000` for local development
3. Run:

```bash
cd backend
npm install
npm run dev
```

## Vercel / production setup

- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your Vercel project environment variables.
- Add `NEXT_PUBLIC_BACKEND_URL` to the frontend app environment variables so the browser can reach the deployed backend.
- Keep the service role key secret; do not commit it to source control.

## Supported routes

- `GET /v1/programs`
- `POST /v1/admissions`
- `POST /v1/admissions/review`
- `POST /v1/admissions/letter`
- `GET /v1/admissions/stats`
- `GET /v1/admissions/by-trade`
- `GET /v1/admissions/my-applications`
- `GET /v1/trades`
- `GET /v1/trades/categories`
- `GET /v1/trades/courses?trade_code=...`
- `POST /v1/trades`
- `PUT /v1/trades`
- `POST /v1/trades/courses`
- `POST /v1/trades/modules`
- `GET /v1/students`
- `POST /v1/students`
- `PUT /v1/students`
- `GET /v1/students/courses`
- `GET /v1/students/modules?course_id=...`
- `POST /v1/students/progress`
- `GET /v1/staff`
- `GET /v1/staff/id-card`
- `GET /v1/staff/remuneration`
- `GET /v1/staff/finance`
- `POST /v1/staff`
- `PUT /v1/staff`
- `GET /v1/staff/department?code=...`
- `POST /v1/staff/performance`

## Notes

- The server currently uses the Supabase Service Role key to run authenticated queries and RPCs.
- `staff` / `finance` / `remuneration` endpoints are placeholder routes for future payroll / staff reporting integration.
