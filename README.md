# Us, Maybe?

A private, multilingual compatibility questionnaire and live review dashboard.

The public side feels like a personal invitation. The private owner dashboard stores partial answers, meaningful interaction events, answer revisions, six compatibility dimensions, contradictions, follow-up topics, and the owner's final decision.

## Product behavior

- One random, unguessable invitation token per person
- No candidate name, phone number, username, or dating-app identity inside the URL
- English, Russian, Indonesian, Arabic, and Turkish
- Full right-to-left layout for Arabic
- Explicit disclosure before detailed progress tracking begins
- Immediate save for choices
- Debounced draft save for written responses
- Full saved answer revision history, without raw keystroke logging
- Live dashboard updates through Supabase Realtime
- Partial answers remain visible when someone leaves before finishing
- User-controlled permanent deletion
- No public score, pass result, or automatic rejection for nuanced answers
- Six private compatibility dimensions
- Row Level Security for every owner-readable table
- Public writes go through protected server routes using the Supabase service role

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Auth
- Supabase Realtime
- Vercel

Railway is not required for this version. Supabase already supplies the database, authentication, realtime changes, and server-side RPC needed by the product.

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Create a Supabase project.

3. Open the Supabase SQL editor and run:

```text
supabase/migrations/202608070001_us_maybe.sql
```

4. Copy the environment template.

```bash
cp .env.example .env.local
```

5. Fill every value in `.env.local`.

Generate the invitation encryption key with:

```bash
openssl rand -base64 32
```

6. Start the application.

```bash
npm run dev
```

7. Open `http://localhost:3000/admin/login`.

8. Create the owner account. If Supabase email confirmation is enabled, confirm the email before signing in.

9. Open `My standards` and review the default compatibility baseline.

10. Create the first private invitation from the dashboard.

## Supabase authentication settings

For a private owner dashboard:

- Keep email and password authentication enabled.
- Set the Site URL to the production Vercel URL.
- Add `http://localhost:3000` as a local redirect URL.
- After the owner account exists, disable new user signups in Supabase Auth if this application should remain single-owner.

## Data model

The migration creates:

- `profiles`
- `owner_standards`
- `candidates`
- `invitations`
- `public_sessions`
- `answers`
- `answer_revisions`
- `interaction_events`
- `assessments`
- `candidate_reviews`

The public browser never receives the service role key. It also never reads database tables directly. Public submissions reach Next.js route handlers, which validate the invitation, session, consent state, active question, and payload before writing.

The owner dashboard uses Supabase Auth and Row Level Security. Each authenticated owner only sees records tied to their own `owner_id`.

## Invitation security

Every link uses a random 24-byte token represented as a URL-safe string. The database stores:

- A SHA-256 token hash for lookup
- An AES-256-GCM encrypted copy so the owner can copy the existing link later

The encryption key remains server-only.

Rotating a link invalidates the old token and creates a new one. Revoking a link closes it without deleting the candidate record.

## Progress tracking policy

The site records meaningful actions after consent:

- Language selected
- Consent accepted or declined
- Profile completed
- Gate completed
- Chapter started or completed
- Question viewed
- Option selected or changed
- Draft saved
- Back or next pressed
- Visibility changed
- Heartbeat
- Submission
- Deletion

The site does not record:

- Raw keystrokes
- Deleted words between saved revisions
- Mouse coordinates
- Empty-space taps
- Passwords
- Device files
- Camera or microphone data
- Activity outside the questionnaire

## Translation behavior

All fixed interface text and answer choices are translated inside the codebase. Written answers are preserved in their original language. The database includes an optional `translated_text` field for a future translation provider. The original response should always remain visible even after translation is added.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Or run all checks:

```bash
npm run check
```

## Vercel deployment

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Add all five environment variables from `.env.example`.
4. Deploy.
5. Replace `NEXT_PUBLIC_SITE_URL` with the final production URL and redeploy.
6. Update the Supabase Auth Site URL and allowed redirect URLs.

The Vercel build command is:

```bash
npm run build
```

The output framework is detected automatically as Next.js.

## Production checklist

- Run the Supabase migration
- Confirm RLS is enabled on every table
- Confirm the service role key exists only in server environment variables
- Create the owner account
- Disable public signup after owner setup when desired
- Set the Vercel production URL in Supabase Auth
- Set `NEXT_PUBLIC_SITE_URL`
- Replace `public/naim-portrait.svg` with a real, respectful photo or portrait asset when ready
- Test one invitation in every supported language
- Test Arabic right-to-left layout
- Test closing and reopening an unfinished questionnaire
- Test live dashboard updates in a second browser
- Test answer deletion
- Test link revocation and rotation
- Test mobile touch targets and reduced-motion mode

## Privacy note

This application stores sensitive relationship, religious, and family-preference information. The opening consent screen states what is saved and what is not saved. Keep retention periods short, remove unused candidate records, and honor deletion requests.
