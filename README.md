# IndustryRank

Facemash-style company ranking platform. Vote head-to-head between companies within an industry. Rankings computed using ELO.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + inline styles
- **Logos:** Clearbit Logo API with initials fallback
- **Company verification:** Brave Search API (or SerpAPI)
- **Deployment:** Vercel + GitHub

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase project

1. Go to supabase.com and create a new project.
2. In the SQL editor, run the contents of `supabase/schema.sql`.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BRAVE_SEARCH_API_KEY=your-brave-search-api-key
```

### 4. Seed the database

```bash
npx ts-node --project tsconfig.seed.json scripts/seed.ts
```

### 5. Run locally

```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add env vars in Vercel dashboard
4. Deploy
