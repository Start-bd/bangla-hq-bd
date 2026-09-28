// Runs before `vite dev` and `vite build`; writes public/sitemap.xml (en) and public/sitemap-bn.xml (bn)
// with reciprocal absolute hreflang alternates.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://banglahq.com";
const TODAY = new Date().toISOString().split("T")[0];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/directory", priority: "0.9", changefreq: "daily" },
  { path: "/startups", priority: "0.8", changefreq: "weekly" },
  { path: "/pricing", priority: "0.7", changefreq: "monthly" },
  { path: "/tools", priority: "0.6", changefreq: "monthly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const enUrl = (p: string) => `${BASE_URL}${p}`;
const bnUrl = (p: string) => `${BASE_URL}${p === "/" ? "/bn/" : `/bn${p}`}`;

type Page = { path: string; lastmod: string; changefreq: string; priority: string };

function entry(p: Page, lang: "en" | "bn") {
  const loc = lang === "en" ? enUrl(p.path) : bnUrl(p.path);
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl(p.path))}" />
    <xhtml:link rel="alternate" hreflang="bn-BD" href="${escapeXml(bnUrl(p.path))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl(p.path))}" />
  </url>`;
}

const xmlFor = (entries: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

async function main() {
  let businesses: { slug: string; updated_at: string | null }[] = [];
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await supabase
        .from("businesses")
        .select("slug, updated_at")
        .eq("status", "active")
        .order("updated_at", { ascending: false });
      businesses = data ?? [];
    } catch (e) {
      console.warn("sitemap: failed to fetch businesses, continuing with static pages only", e);
    }
  }

  const pages: Page[] = [
    ...staticPages.map((p) => ({ ...p, lastmod: TODAY })),
    ...businesses.map((b) => ({
      path: `/${b.slug}`,
      lastmod: b.updated_at ? new Date(b.updated_at).toISOString().split("T")[0] : TODAY,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  writeFileSync(resolve("public/sitemap.xml"), xmlFor(pages.map((p) => entry(p, "en"))));
  writeFileSync(resolve("public/sitemap-bn.xml"), xmlFor(pages.map((p) => entry(p, "bn"))));
  console.log(`sitemaps written: ${pages.length} URLs each (en + bn)`);
}

main();
