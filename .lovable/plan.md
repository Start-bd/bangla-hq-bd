

# BanglaHQ — Database, Stripe, SEO & Seed Data Plan

This plan covers the first two actionable follow-up prompts: setting up the full database schema with RLS, integrating Stripe for monetization, seeding 50 businesses, and adding JSON-LD structured data to business profiles.

---

## Phase 1: Database Schema (Migration)

Create all core tables via database migration:

**Tables to create:**
1. **profiles** — user profiles linked to auth.users (id, full_name, full_name_bn, email, preferred_language, created_at)
2. **user_roles** — role-based access (user_id, role enum: admin/moderator/user)
3. **businesses** — full schema from spec (slug, bilingual names, category, location, contact, social, plan tier, verification status, ratings, services JSONB, etc.)
4. **reviews** — ratings and text reviews linked to businesses and profiles
5. **rfqs** — B2B quote requests with budget, timeline, category
6. **quotes** — responses to RFQs from businesses
7. **startups** — startup-specific data (funding stage, problem/solution, traction)
8. **news_posts** — bilingual business news articles
9. **business_views** — daily view tracking per business

**RLS policies:**
- businesses: public SELECT for active status; owner full CRUD on own records
- reviews: public SELECT for active; authenticated INSERT; owner UPDATE/DELETE
- rfqs/quotes: authenticated read/insert
- startups: public SELECT; owner manage
- news_posts: public SELECT where published; admin insert/update
- profiles: owner SELECT/UPDATE own record
- user_roles: security definer function `has_role()` to avoid recursion

**Enable realtime** on reviews and rfqs tables for live updates.

## Phase 2: Seed 50 Businesses

Use the insert tool to populate ~50 businesses across all categories and divisions, including:
- StartBD ecosystem: StartBD, InteriorOfAI, MeetBD, BanglaSEO, Caption.cloud
- Major companies: Grameenphone, bKash, Walton, Square, Pathao, Daraz, Robi, ACI, BRAC, Beximco, etc.
- Category coverage across IT, Garments, Healthcare, Education, Restaurant, Finance, Construction, Transport, Agriculture
- Division coverage across all 8 divisions

## Phase 3: Enable Stripe

Use the Stripe enablement tool to set up:
- **Pro Plan**: ৳1,500/month subscription
- **Verified Badge**: ৳499 one-time payment
- **Featured Listing**: ৳2,000/week

This creates products/prices in Stripe and wires up checkout + webhook handling to update `businesses.plan` and `businesses.is_verified`.

## Phase 4: Update App to Use Database

Refactor pages to query from the database instead of mock data:
- **Directory page**: Query `businesses` table with filters (category, division, search)
- **Business Profile page**: Fetch single business by slug from DB
- **Startups page**: Query businesses where `is_startup = true`, join with `startups` table
- **Index page**: Featured businesses from DB, real stats counts

Keep mock data as fallback during transition.

## Phase 5: JSON-LD LocalBusiness Schema

Add structured data to `BusinessProfile.tsx`:
- Inject `<script type="application/ld+json">` with LocalBusiness schema
- Fields: name, description, address (district/division), telephone, url, aggregateRating, category
- Dynamic meta tags: `<title>` and `<meta description>` per business
- This enables Google rich results for every listed business

---

## Technical Details

- Database migration will be a single SQL migration with all tables, enums, RLS policies, and triggers
- Validation triggers instead of CHECK constraints for time-based fields (e.g., `featured_until`, `plan_expires_at`)
- `has_role()` security definer function for role checks without RLS recursion
- Stripe integration follows Lovable's built-in Stripe tooling
- JSON-LD uses `react-helmet-async` or inline script injection in the component
- All business queries will use the Supabase client SDK with proper typing

## Implementation Order

1. Run database migration (tables + RLS + functions)
2. Seed 50 businesses via insert tool
3. Enable Stripe via tool
4. Update frontend to query DB
5. Add JSON-LD to business profiles
6. Add authentication pages (login/signup) since RLS requires auth for write operations

