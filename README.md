# Us, Maybe?

Private compatibility invitations with a candidate questionnaire and owner review dashboard.

## Architecture

- GitHub is the source of truth.
- Railway builds and hosts the Next.js application.
- Supabase provides Auth, Postgres, Realtime, answers, and activity tracking.

The public API routes proxy validated candidate requests to the existing Supabase server function:

- `/api/public/bootstrap`
- `/api/public/event`
- `/api/public/answer`
- `/api/public/submit`
- `/api/public/delete`

## Environment

Configure the values from `.env.example` in Railway. Keep private keys out of GitHub.

## Checks

```bash
npm run check
```
