-- IndustryRank Schema

-- Companies table
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  domain        text not null unique,
  industry      text not null,
  created_at    timestamptz default now(),
  verified      boolean default true
);

-- Ratings table
create table if not exists ratings (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid references companies(id) on delete cascade,
  industry_scope text not null,   -- 'in_industry' | 'all'
  voter_level    text not null,   -- 'student' | 'entry' | 'mid' | 'senior' | 'global'
  elo            numeric default 1200,
  wins           integer default 0,
  losses         integer default 0,
  total_votes    integer default 0,
  updated_at     timestamptz default now(),
  unique(company_id, industry_scope, voter_level)
);

-- Company requests table
create table if not exists company_requests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  industry      text not null,
  status        text default 'pending',  -- 'pending' | 'approved' | 'rejected'
  requester_ip  text,
  created_at    timestamptz default now()
);

-- Vote limits (rate limiting)
create table if not exists vote_limits (
  ip_hash   text,
  industry  text,
  date      date,
  count     integer default 0,
  primary key (ip_hash, industry, date)
);

-- Enable Row Level Security
alter table companies enable row level security;
alter table ratings enable row level security;
alter table company_requests enable row level security;
alter table vote_limits enable row level security;

-- RLS Policies: Public read for companies
create policy "Public read companies"
  on companies for select
  using (true);

-- RLS Policies: Service role insert/update companies
create policy "Service insert companies"
  on companies for insert
  with check (auth.role() = 'service_role');

create policy "Service update companies"
  on companies for update
  using (auth.role() = 'service_role');

-- RLS Policies: Public read ratings
create policy "Public read ratings"
  on ratings for select
  using (true);

-- RLS Policies: Service role insert/update ratings
create policy "Service insert ratings"
  on ratings for insert
  with check (auth.role() = 'service_role');

create policy "Service update ratings"
  on ratings for update
  using (auth.role() = 'service_role');

-- RLS Policies: Public insert company_requests
create policy "Public insert company_requests"
  on company_requests for insert
  with check (true);

-- RLS Policies: Service role insert/update vote_limits
create policy "Service manage vote_limits"
  on vote_limits for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Indexes for performance
create index if not exists idx_companies_industry on companies(industry);
create index if not exists idx_ratings_company_id on ratings(company_id);
create index if not exists idx_ratings_scope_level on ratings(industry_scope, voter_level);
create index if not exists idx_vote_limits_lookup on vote_limits(ip_hash, industry, date);
