# Prerendering and bilingual search rollout

## Goal
Make BanglaHQ’s English and Bangla public pages independently crawlable, reduce the initial JavaScript download, publish accurate sitemaps, and complete the Search Console steps that the available APIs support.

## Implementation

### 1. Add stable English and Bangla URL structures
- Keep existing English URLs unchanged: `/`, `/directory`, `/startups`, `/pricing`, `/tools`, `/about`, and `/{business-slug}`.
- Add equivalent Bangla URLs: `/bn/`, `/bn/directory`, `/bn/startups`, `/bn/pricing`, `/bn/tools`, `/bn/about`, and `/bn/{business-slug}`.
- Make the URL prefix determine the initial language so `/bn/...` always renders Bangla on first load and English URLs render English.
- Update the language control and all public internal links to switch or preserve the matching localized URL instead of only changing temporary browser state.
- Keep account, onboarding, dashboard, and missing-page URLs out of both sitemaps.

### 2. Make metadata language-aware
- Centralize public-page SEO metadata to avoid conflicting tags.
- Give every indexable page a localized title and description, self-referencing canonical URL, `og:url`, `og:locale`, and reciprocal `hreflang` links for `en`, `bn-BD`, and `x-default`.
- Localize business-profile metadata and structured data from each profile’s English/Bangla fields while omitting empty optional values.
- Correct the base HTML head structure and retain Google Analytics and Search Console verification tags.

### 3. Split the client bundle
- Lazy-load public pages, account pages, and dashboard routes so visitors download the shared shell plus only the code needed for the current page.
- Add a stable loading fallback without changing the existing visual design or user flows.
- Keep shared navigation, language handling, notifications, and data caching in the client shell.

### 4. Prerender crawlable pages during production builds
- Add a post-build prerender script using the project’s existing browser tooling.
- Render all indexable English and Bangla static routes plus every active business profile into route-specific HTML files after the production bundle is created.
- Wait for business data and route metadata before saving each page, while preserving the JavaScript client shell for normal interaction after load.
- Fail the production build when a required public route cannot be rendered, rather than silently shipping blank or incomplete SEO pages.
- Leave authenticated/private pages as client-rendered routes.

### 5. Generate separate English and Bangla sitemaps
- Generate `/sitemap.xml` with English static pages and active English business-profile URLs.
- Generate `/sitemap-bn.xml` with the equivalent `/bn/` URLs.
- Include correct `lastmod` values and available business images, and add reciprocal language alternates within sitemap entries where supported.
- Update `robots.txt` to advertise both sitemap URLs.
- Align the build-time and live sitemap generators so their route lists, language URLs, XML headers, and escaping rules cannot drift.

### 6. Validate and release
- Verify representative desktop and mobile pages with JavaScript disabled to confirm useful content, headings, metadata, links, and business data exist in the delivered HTML.
- Verify route navigation and language switching still work with JavaScript enabled.
- Check the production output for route-specific HTML and smaller initial route bundles.
- Publish the completed changes after approval.

### 7. Complete Search Console actions
- After the new files are live, list verified Search Console properties and use the exact verified property covering `https://banglahq.com/`.
- Submit both `https://banglahq.com/sitemap.xml` and `https://banglahq.com/sitemap-bn.xml`, then read back their submission status.
- Inspect the homepage, directory, Bangla homepage/directory, and a prioritized sample of active business profiles to establish their indexed/crawl state.
- Prepare the exact profile URL list that still needs attention. Google’s API cannot request indexing or run a live URL test, so the final “Request indexing” clicks must be completed manually in Search Console’s URL Inspection screen.

## Technical notes
- The app remains React + Vite; no framework migration or backend replacement is required.
- Prerendering produces crawler-readable HTML while the existing app remains interactive in the browser.
- Existing English URLs keep their rankings and backlinks; Bangla receives dedicated URLs rather than replacing them.
- Search Console and sitemap submission happen only after publication confirms the generated files are live.
