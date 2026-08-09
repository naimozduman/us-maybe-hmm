create table if not exists public.um_owner_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (char_length(token_hash) = 64),
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists um_owner_reset_tokens_active_idx
  on public.um_owner_reset_tokens (user_id, expires_at)
  where used_at is null;

alter table public.um_owner_reset_tokens enable row level security;

revoke all on table public.um_owner_reset_tokens from anon, authenticated;
