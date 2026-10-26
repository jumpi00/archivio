-- Archivio: commenti sulle pagine (progetto Supabase di Whenly, tabelle con prefisso archivio_)
-- Da lanciare una volta nel SQL Editor di Supabase.
-- PRIMA di lanciarlo sostituisci SCRIVI-QUI-IL-TUO-PIN (in fondo) con il PIN che vuoi usare per cancellare.
-- Il PIN viene salvato solo cifrato: non finisce in questo repo.

-- Commenti: chiunque legge e scrive, nessuno cancella direttamente
create table if not exists public.archivio_comments (
  id bigint generated always as identity primary key,
  page text not null check (char_length(page) between 1 and 120),
  name text check (name is null or char_length(name) <= 40),
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists archivio_comments_page_idx on public.archivio_comments (page, created_at);

alter table public.archivio_comments enable row level security;

drop policy if exists "archivio commenti: lettura" on public.archivio_comments;
create policy "archivio commenti: lettura" on public.archivio_comments
  for select to anon, authenticated using (true);

drop policy if exists "archivio commenti: scrittura" on public.archivio_comments;
create policy "archivio commenti: scrittura" on public.archivio_comments
  for insert to anon, authenticated with check (true);

revoke all on public.archivio_comments from anon, authenticated;
grant select on public.archivio_comments to anon, authenticated;
grant insert (page, name, body) on public.archivio_comments to anon, authenticated;

-- Freno allo spam: al massimo 5 commenti al minuto sulla stessa pagina
create or replace function public.archivio_comments_throttle()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.archivio_comments
      where page = new.page and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Troppi commenti in poco tempo, riprova tra un minuto';
  end if;
  return new;
end $$;

drop trigger if exists archivio_comments_throttle on public.archivio_comments;
create trigger archivio_comments_throttle before insert on public.archivio_comments
  for each row execute function public.archivio_comments_throttle();

-- PIN di cancellazione (solo cifrato, non leggibile dal sito)
create table if not exists public.archivio_admin (
  id int primary key default 1 check (id = 1),
  pin_hash text not null
);
alter table public.archivio_admin enable row level security;
revoke all on public.archivio_admin from anon, authenticated;

-- Tentativi di PIN sbagliati: dopo 10 in 15 minuti la cancellazione si blocca per un po'
create table if not exists public.archivio_pin_attempts (
  at timestamptz not null default now()
);
alter table public.archivio_pin_attempts enable row level security;
revoke all on public.archivio_pin_attempts from anon, authenticated;

create or replace function public.archivio_delete_comment(p_id bigint, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  h text;
begin
  delete from public.archivio_pin_attempts where at < now() - interval '1 day';
  if (select count(*) from public.archivio_pin_attempts where at > now() - interval '15 minutes') >= 10 then
    raise exception 'Troppi tentativi, riprova tra qualche minuto';
  end if;

  select pin_hash into h from public.archivio_admin where id = 1;
  if h is null or crypt(p_pin, h) <> h then
    insert into public.archivio_pin_attempts default values;
    return false;
  end if;

  delete from public.archivio_comments where id = p_id;
  return true;
end $$;

revoke all on function public.archivio_delete_comment(bigint, text) from public;
grant execute on function public.archivio_delete_comment(bigint, text) to anon, authenticated;

-- Imposta (o cambia) il PIN. Sostituisci il testo tra apici, poi lancia.
insert into public.archivio_admin (id, pin_hash)
values (1, extensions.crypt('SCRIVI-QUI-IL-TUO-PIN', extensions.gen_salt('bf')))
on conflict (id) do update set pin_hash = excluded.pin_hash;
