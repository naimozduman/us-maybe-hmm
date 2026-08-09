create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owner_standards (
  owner_id uuid primary key references public.profiles(id) on delete cascade,
  questionnaire_version text not null,
  standards jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  source text,
  preferred_language text check (preferred_language is null or preferred_language in ('en','ru','id','ar','tr')),
  notes text,
  status text not null default 'draft' check (status in ('draft','invited','opened','in_progress','submitted','declined','withdrawn','revoked','expired','closed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  token_hash text not null unique,
  token_ciphertext text not null,
  questionnaire_version text not null,
  standards_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','opened','in_progress','submitted','declined','withdrawn','revoked','expired')),
  expires_at timestamptz,
  opened_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_sessions (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  session_hash text not null unique,
  language text check (language is null or language in ('en','ru','id','ar','tr')),
  current_stage text,
  current_question text,
  progress integer not null default 0 check (progress between 0 and 100),
  state text not null default 'online' check (state in ('online','idle','disconnected','submitted')),
  consented_at timestamptz,
  last_seen_at timestamptz not null default now(),
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  question_id text not null,
  value jsonb not null,
  language text not null check (language in ('en','ru','id','ar','tr')),
  is_draft boolean not null default false,
  translated_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, question_id)
);

create table if not exists public.answer_revisions (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  question_id text not null,
  value jsonb not null,
  language text not null check (language in ('en','ru','id','ar','tr')),
  is_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.interaction_events (
  id bigint generated always as identity primary key,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  session_id uuid references public.public_sessions(id) on delete set null,
  event_type text not null,
  screen_id text,
  question_id text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null unique references public.invitations(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  overall_score numeric(5,2),
  dimensions jsonb not null default '{}'::jsonb,
  hard_mismatches jsonb not null default '[]'::jsonb,
  character_concerns jsonb not null default '[]'::jsonb,
  discussion_flags jsonb not null default '[]'::jsonb,
  contradictions jsonb not null default '[]'::jsonb,
  follow_ups jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_reviews (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  candidate_id uuid not null unique references public.candidates(id) on delete cascade,
  decision text not null default 'undecided' check (decision in ('continue','discuss','close','archive','undecided')),
  private_notes text not null default '',
  manual_labels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists candidates_owner_created_idx on public.candidates(owner_id, created_at desc);
create index if not exists invitations_owner_created_idx on public.invitations(owner_id, created_at desc);
create index if not exists invitations_candidate_created_idx on public.invitations(candidate_id, created_at desc);
create index if not exists sessions_candidate_last_seen_idx on public.public_sessions(candidate_id, last_seen_at desc);
create index if not exists sessions_invitation_idx on public.public_sessions(invitation_id);
create index if not exists answers_candidate_idx on public.answers(candidate_id, updated_at);
create index if not exists answers_invitation_idx on public.answers(invitation_id, updated_at);
create index if not exists revisions_candidate_question_idx on public.answer_revisions(candidate_id, question_id, created_at);
create index if not exists events_candidate_time_idx on public.interaction_events(candidate_id, occurred_at desc);
create index if not exists events_invitation_time_idx on public.interaction_events(invitation_id, occurred_at desc);
create index if not exists assessments_candidate_idx on public.assessments(candidate_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'Owner'), '@', 1), 'Owner'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.withdraw_public_submission(
  target_invitation_id uuid,
  target_candidate_id uuid,
  withdrawn_at_value timestamptz
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not exists (
    select 1 from public.invitations
    where id = target_invitation_id and candidate_id = target_candidate_id
  ) then
    raise exception 'Invitation and candidate do not match';
  end if;

  delete from public.answer_revisions where invitation_id = target_invitation_id;
  delete from public.interaction_events where invitation_id = target_invitation_id;
  delete from public.answers where invitation_id = target_invitation_id;
  delete from public.assessments where invitation_id = target_invitation_id;
  delete from public.public_sessions where invitation_id = target_invitation_id;

  update public.invitations
  set status = 'withdrawn',
      token_hash = encode(digest(gen_random_uuid()::text || clock_timestamp()::text, 'sha256'), 'hex'),
      token_ciphertext = 'withdrawn',
      updated_at = withdrawn_at_value
  where id = target_invitation_id;

  update public.candidates
  set status = 'withdrawn', updated_at = withdrawn_at_value
  where id = target_candidate_id;
end;
$$;

revoke all on function public.withdraw_public_submission(uuid, uuid, timestamptz) from public;
revoke all on function public.withdraw_public_submission(uuid, uuid, timestamptz) from anon;
revoke all on function public.withdraw_public_submission(uuid, uuid, timestamptz) from authenticated;
grant execute on function public.withdraw_public_submission(uuid, uuid, timestamptz) to service_role;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_owner_standards_updated_at on public.owner_standards;
create trigger set_owner_standards_updated_at
before update on public.owner_standards
for each row execute function public.set_updated_at();

drop trigger if exists set_candidates_updated_at on public.candidates;
create trigger set_candidates_updated_at
before update on public.candidates
for each row execute function public.set_updated_at();

drop trigger if exists set_invitations_updated_at on public.invitations;
create trigger set_invitations_updated_at
before update on public.invitations
for each row execute function public.set_updated_at();

drop trigger if exists set_public_sessions_updated_at on public.public_sessions;
create trigger set_public_sessions_updated_at
before update on public.public_sessions
for each row execute function public.set_updated_at();

drop trigger if exists set_answers_updated_at on public.answers;
create trigger set_answers_updated_at
before update on public.answers
for each row execute function public.set_updated_at();

drop trigger if exists set_assessments_updated_at on public.assessments;
create trigger set_assessments_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

drop trigger if exists set_candidate_reviews_updated_at on public.candidate_reviews;
create trigger set_candidate_reviews_updated_at
before update on public.candidate_reviews
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.owner_standards enable row level security;
alter table public.candidates enable row level security;
alter table public.invitations enable row level security;
alter table public.public_sessions enable row level security;
alter table public.answers enable row level security;
alter table public.answer_revisions enable row level security;
alter table public.interaction_events enable row level security;
alter table public.assessments enable row level security;
alter table public.candidate_reviews enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "standards_select_own" on public.owner_standards for select to authenticated using (owner_id = auth.uid());
create policy "standards_insert_own" on public.owner_standards for insert to authenticated with check (owner_id = auth.uid());
create policy "standards_update_own" on public.owner_standards for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "standards_delete_own" on public.owner_standards for delete to authenticated using (owner_id = auth.uid());

create policy "candidates_select_own" on public.candidates for select to authenticated using (owner_id = auth.uid());
create policy "candidates_insert_own" on public.candidates for insert to authenticated with check (owner_id = auth.uid());
create policy "candidates_update_own" on public.candidates for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "candidates_delete_own" on public.candidates for delete to authenticated using (owner_id = auth.uid());

create policy "invitations_select_own" on public.invitations for select to authenticated using (owner_id = auth.uid());
create policy "invitations_insert_own" on public.invitations for insert to authenticated with check (owner_id = auth.uid());
create policy "invitations_update_own" on public.invitations for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "invitations_delete_own" on public.invitations for delete to authenticated using (owner_id = auth.uid());

create policy "sessions_select_via_owner" on public.public_sessions for select to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = public_sessions.invitation_id and invitation.owner_id = auth.uid())
);
create policy "sessions_delete_via_owner" on public.public_sessions for delete to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = public_sessions.invitation_id and invitation.owner_id = auth.uid())
);

create policy "answers_select_via_owner" on public.answers for select to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = answers.invitation_id and invitation.owner_id = auth.uid())
);
create policy "answers_update_via_owner" on public.answers for update to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = answers.invitation_id and invitation.owner_id = auth.uid())
) with check (
  exists (select 1 from public.invitations invitation where invitation.id = answers.invitation_id and invitation.owner_id = auth.uid())
);
create policy "answers_delete_via_owner" on public.answers for delete to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = answers.invitation_id and invitation.owner_id = auth.uid())
);

create policy "revisions_select_via_owner" on public.answer_revisions for select to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = answer_revisions.invitation_id and invitation.owner_id = auth.uid())
);
create policy "revisions_delete_via_owner" on public.answer_revisions for delete to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = answer_revisions.invitation_id and invitation.owner_id = auth.uid())
);

create policy "events_select_via_owner" on public.interaction_events for select to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = interaction_events.invitation_id and invitation.owner_id = auth.uid())
);
create policy "events_delete_via_owner" on public.interaction_events for delete to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = interaction_events.invitation_id and invitation.owner_id = auth.uid())
);

create policy "assessments_select_via_owner" on public.assessments for select to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = assessments.invitation_id and invitation.owner_id = auth.uid())
);
create policy "assessments_update_via_owner" on public.assessments for update to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = assessments.invitation_id and invitation.owner_id = auth.uid())
) with check (
  exists (select 1 from public.invitations invitation where invitation.id = assessments.invitation_id and invitation.owner_id = auth.uid())
);
create policy "assessments_delete_via_owner" on public.assessments for delete to authenticated using (
  exists (select 1 from public.invitations invitation where invitation.id = assessments.invitation_id and invitation.owner_id = auth.uid())
);

create policy "reviews_select_own" on public.candidate_reviews for select to authenticated using (owner_id = auth.uid());
create policy "reviews_insert_own" on public.candidate_reviews for insert to authenticated with check (owner_id = auth.uid());
create policy "reviews_update_own" on public.candidate_reviews for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "reviews_delete_own" on public.candidate_reviews for delete to authenticated using (owner_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.owner_standards to authenticated;
grant select, insert, update, delete on public.candidates to authenticated;
grant select, insert, update, delete on public.invitations to authenticated;
grant select, delete on public.public_sessions to authenticated;
grant select, update, delete on public.answers to authenticated;
grant select, delete on public.answer_revisions to authenticated;
grant select, delete on public.interaction_events to authenticated;
grant select, update, delete on public.assessments to authenticated;
grant select, insert, update, delete on public.candidate_reviews to authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array['candidates','invitations','public_sessions','answers','answer_revisions','interaction_events','assessments','candidate_reviews']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = target_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', target_table);
    end if;
  end loop;
end $$;
