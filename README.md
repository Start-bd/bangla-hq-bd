# BanglaHQ — Bangladesh Business Directory

BanglaHQ is Bangladesh's official business directory and growth platform — connecting verified companies, startups, and customers across every district. Available in English and Bangla, with dedicated `/bn/...` URLs for every public page.

Built with **React 18 + Vite + TypeScript + shadcn/ui (Radix primitives) + Supabase + TanStack Query**.

## Quick start

```bash
npm install
cp .env.example .env        # fill in your Supabase URL + publishable key
npm run dev                 # starts Vite on http://localhost:8080
```

On first run (and before every `npm run build`) the project fetches active businesses from Supabase and writes `public/sitemap.xml` + `public/sitemap-bn.xml`.

## Build & deploy

```bash
npm run build              # builds the app, generates sitemaps, then prerenders HTML
npm run preview            # serves the production build locally
```

`npm run build` runs in order:

1. `prebuild` — generates `public/sitemap.xml` and `public/sitemap-bn.xml`
2. `vite build` — produces the production bundle under `dist/`
3. `postbuild` — prerenders every indexable English + Bangla route (static pages + active business profiles) into route-specific `dist/{path}/index.html` files using Playwright

The prerender step requires Playwright's Chromium browser: run `npx playwright install chromium` once before your first production build.

### Environment variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (also reads `SUPABASE_URL`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key (also reads `SUPABASE_PUBLISHABLE_KEY`) |
| `VITE_PREVIEW_PORT` | Port the prerender script uses to connect to `vite preview` (default `4173`) |

The `.env` file is gitignored. The repo ships with a `.env` snapshot containing the production Supabase project ID — **rotate the publishable key if this repo becomes public**.

## Project structure

```
src/
  App.tsx                 # root router — lazy-loads all pages, wraps shell
  components/
    PublicSeo.tsx         # centralized SEO: title, meta, OG, hreflang, canonical, JSON-LD
    PublicLayout.tsx      # navbar + footer + PrerenderReady hook
    Navbar.tsx            # primary nav with bilingual language toggle
    BusinessCard.tsx      # reusable business listing card
    ui/                   # shadcn/ui components (button, dialog, etc.)
  pages/
    Index.tsx             # homepage (hero + search + featured businesses)
    Directory.tsx         # browsable business directory with filters
    BusinessProfile.tsx   # single business profile with tabs + structured data
    Startups.tsx          # startups showcase
    Pricing.tsx           # plans and pricing
    Tools.tsx             # curated tools directory
    About.tsx             # about page
    AuthLogin.tsx         # login
    AuthSignup.tsx        # signup
    Onboarding.tsx        # add-business flow
    Dashboard.tsx         # authenticated dashboard
    NotFound.tsx          # 404 page
  hooks/
    use-businesses.ts     # TanStack Query hooks for businesses + stats
    use-auth.ts           # auth session helpers
    use-mobile.tsx        # responsive breakpoint hook
    use-toast.ts          # toast notification hook
  lib/
    language-context.tsx  # bilingual context: lang, t(), localizePath, toggleLang
    mock-data.ts          # Business type + seed categories/divisions/tools
    utils.ts              # cn() tailwind-merge helper
  integrations/supabase/  # generated Supabase client + DB types
scripts/
  generate-sitemap.ts     # generates sitemap.xml + sitemap-bn.xml from Supabase
  prerender.ts            # post-build Playwright prerender of indexable routes
supabase/
  config.toml             # Supabase project ID
  migrations/             # DB schema (profiles, user_roles, businesses, RLS policies)
```

## Bilingual routing

The URL prefix determines the initial language:

| English | Bangla |
|---|---|
| `/` | `/bn/` |
| `/directory` | `/bn/directory` |
| `/startups` | `/bn/startups` |
| `/pricing` | `/bn/pricing` |
| `/tools` | `/bn/tools` |
| `/about` | `/bn/about` |
| `/{business-slug}` | `/bn/{business-slug}` |

Account, onboarding, dashboard, and 404 routes are not localized — they live outside the language prefix.

Every public page renders `<link rel="alternate" hreflang="en|bn-BD|x-default">` plus a self-referencing canonical, so search engines know both language versions exist.

## Supabase schema

- **profiles** — per-user profile (name, avatar, preferred language)
- **user_roles** — `admin` / `moderator` / `user` roles
- **businesses** — listings with EN/BN name, tagline, description, category, division/district, contact, social, plan, verification, featured/startup flags, ratings, view count, services (JSONB), tags
- **RLS policies** — public read on active businesses; startups view restricted to active-business owners and admins

## Testing

```bash
npm test                    # run vitest once
npm run test:watch         # watch mode
npm run test:ui            # interactive UI (requires @vitest/ui installed)
```

Test files live under `src/` and match `src/**/*.test.ts(x)`.

## SEO checklist for releases

- [ ] `public/sitemap.xml` and `public/sitemap-bn.xml` were regenerated during `npm run build`
- [ ] `public/robots.txt` still points to both sitemaps
- [ ] `index.html` OG image points to a real BanglaHQ asset (not the old Lovable placeholder)
- [ ] No dead links in the navbar (currently: `/directory`, `/startups`, `/tools`)
- [ ] Submit `https://banglahq.com/sitemap.xml` and `https://banglahq.com/sitemap-bn.xml` to Google Search Console
- [ ] Spot-check a sample of English + Bangla business profile pages in the URL Inspection tool

## Tech stack

- React 18, Vite 5, TypeScript 5
- shadcn/ui + Radix UI primitives, Tailwind CSS 3, `class-variance-authority`
- Supabase (auth + Postgres + realtime)
- TanStack Query 5 for server state
- React Helmet Async for document head management
- Playwright for prerendering + E2E test scaffolding
- Vitest + React Testing Library + jsdom for unit tests
- ESLint 9 + TypeScript ESLint

## License

Proprietary — StartBD. See repository settings for contribution and access policy.
