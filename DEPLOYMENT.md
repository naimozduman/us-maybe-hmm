# Production deployment

Public app: https://us-maybe-naim-ozduman.vercel.app

Owner login: https://us-maybe-naim-ozduman.vercel.app/admin/login

Account security: https://us-maybe-naim-ozduman.vercel.app/admin/account

Infrastructure:

- Next.js application on Vercel
- Dedicated Supabase project for Auth, PostgreSQL, Row Level Security, and Realtime
- Railway is intentionally unused because no separate long-running backend is required

Validation completed:

- TypeScript check
- ESLint
- Next.js production build
- Public HTTP smoke test
- Owner password authentication smoke test
- Owner Row Level Security read test

The temporary owner password is stored separately in the handoff credential file generated for the owner. Change it after first login from the Account security page.
