-- Archivio: schede archiviate condivise tra tutti i dispositivi (stesso progetto Supabase dei commenti)
-- Da lanciare una volta nel SQL Editor di Supabase, dopo 001-commenti.sql.
-- Usa lo stesso PIN dei commenti: qui non va scritto nessun PIN.

-- Schede archiviate: chiunque le legge (così il sito sa quali nascondere), nessuno le scrive direttamente
create table if not exists public.archivio_archived (
  item_id text primary key check (char_length(item_id) between 1 and 120),
  note text not null default '' check (char_length(note) <= 300),
  archived_at timestamptz not null default now()
);

alter table public.archivio_archived enable row level security;

drop policy if exists "archivio archiviate: lettura" on public.archivio_archived;
create policy "archivio archiviate: lettura" on public.archivio_archived
  for select to anon, authenticated using (true);

revoke all on public.archivio_archived from anon, authenticated;
grant select on public.archivio_archived to anon, authenticated;

-- Controllo del PIN, con lo stesso blocco dopo 10 tentativi sbagliati in 15 minuti
create or replace function public.archivio_check_pin(p_pin text)
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
  return true;
end $$;

revoke all on function public.archivio_check_pin(text) from public, anon, authenticated;

-- Archivia (o aggiorna il commento di) una scheda
create or replace function public.archivio_archive(p_id text, p_note text, p_pin text, p_date date default null)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.archivio_check_pin(p_pin) then return false; end if;
  insert into public.archivio_archived (item_id, note, archived_at)
  values (p_id, left(coalesce(btrim(p_note), ''), 300), coalesce(p_date::timestamptz, now()))
  on conflict (item_id) do update set note = excluded.note, archived_at = excluded.archived_at;
  return true;
end $$;

revoke all on function public.archivio_archive(text, text, text, date) from public;
grant execute on function public.archivio_archive(text, text, text, date) to anon, authenticated;

-- Ripristina una scheda archiviata
create or replace function public.archivio_unarchive(p_id text, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.archivio_check_pin(p_pin) then return false; end if;
  delete from public.archivio_archived where item_id = p_id;
  return true;
end $$;

revoke all on function public.archivio_unarchive(text, text) from public;
grant execute on function public.archivio_unarchive(text, text) to anon, authenticated;
