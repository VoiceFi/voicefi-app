-- Contacts: each row belongs to one Privy wallet.
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
--
-- NOTE: Auth lives in Privy, not Supabase, so we key contacts by wallet_address
-- (a Solana base58 pubkey) instead of auth.users(id). RLS is intentionally OFF —
-- access is constrained by application-side filters using the connected wallet.
-- If/when you need stronger isolation, mint a Supabase JWT from a server route
-- that has verified the Privy session and re-enable RLS using a custom claim.

create table public.contacts (
  id              uuid primary key default gen_random_uuid(),
  wallet_address  text not null check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  name            text not null check (char_length(btrim(name)) between 1 and 64),
  address         text not null check (address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  created_at      timestamptz not null default now(),
  unique (wallet_address, address)
);

create index contacts_wallet_created_at_idx
  on public.contacts (wallet_address, created_at desc);
