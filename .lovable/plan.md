

# SEO Audit & Fixes — BanglaHQ

## Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **No sitemap.xml** — Search engines can't discover all 49 business profile pages | Critical |
| 2 | **robots.txt missing Sitemap directive** | Critical |
| 3 | **No per-page `<Helmet>` on 5 pages** — Index, Directory, Startups, Pricing, Tools, About all use the static `index.html` title/description instead of unique meta | High |
| 4 | **Missing OG image** — No `og:image` on any page; social shares show no preview | High |
| 5 | **SPA rendering** — All content is client-rendered; search engines with weak JS support won't index business pages | Medium (future) |
| 6 | **No `hreflang` tags** for Bengali/English alternate content | Low |
| 7 | **No Organization JSON-LD** on the homepage | Medium |

## Plan

### 1. Dynamic Sitemap via Edge Function

Create a backend function `sitemap` that queries all business slugs from the database and returns a proper XML sitemap with all static pages + every business profile URL.

```text
/sitemap.xml → edge function returns:
  - https://banglahq.com/
  - https://banglahq.com/directory
  - https://banglahq.com/startups
  - https://banglahq.com/pricing
  - https://banglahq.com/tools
  - https://banglahq.com/about
  - https://banglahq.com/{slug} × 49 businesses
```

### 2. Update robots.txt

Add `Sitemap: https://banglahq.com/sitemap.xml` directive.

### 3. Add `<Helmet>` to All Pages Missing It

Add unique `<title>`, `<meta description>`, `<link canonical>`, and `og:` tags to:
- **Index.tsx** — "BanglaHQ — Bangladesh's Business Directory..."
- **Directory.tsx** — "Business Directory — Browse by Category & District | BanglaHQ"
- **Startups.tsx** — "Bangladesh Startups — Emerging Tech & Innovation | BanglaHQ"
- **Pricing.tsx** — "Pricing Plans — BanglaHQ Business Profiles"
- **Tools.tsx** — "Business Tools — Made in Bangladesh | BanglaHQ"
- **About.tsx** — "About BanglaHQ — Bangladesh's Official Business Directory"

### 4. Add Organization JSON-LD to Homepage

Inject structured data on Index.tsx:
```json
{
  "@type": "Organization",
  "name": "BanglaHQ",
  "url": "https://banglahq.com",
  "description": "Bangladesh's Official Business Directory"
}
```

### 5. Add Default OG Image

Reference a default share image (`/og-banglahq.png`) in `index.html` and override per-page where needed.

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/sitemap/index.ts` | New edge function generating XML sitemap |
| `public/robots.txt` | Add Sitemap directive |
| `index.html` | Add default `og:image` |
| `src/pages/Index.tsx` | Add Helmet + Organization JSON-LD |
| `src/pages/Directory.tsx` | Add Helmet with unique meta |
| `src/pages/Startups.tsx` | Add Helmet with unique meta |
| `src/pages/Pricing.tsx` | Add Helmet with unique meta |
| `src/pages/Tools.tsx` | Add Helmet with unique meta |
| `src/pages/About.tsx` | Add Helmet with unique meta |

