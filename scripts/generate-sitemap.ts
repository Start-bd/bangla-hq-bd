// Runs before `vite dev` and `vite build`; writes public/sitemap.xml (en) and public/sitemap-bn.xml (bn).
// Each sitemap includes <xhtml:link> hreflang alternates so crawlers can discover
// the translated version of every page from either sitemap.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://banglahq.com";
const TODAY = new Date().toISOString().split("T")[0];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/directory", priority: "0.9", changefreq: "daily" },
  { loc: "/startups", priority: "0.8", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.7", changefreq: "monthly" },
  { loc: "/tools", priority: "0.6", changefreq: "monthly" },
  { loc: "/about", priority: "0.5", changefreq: "monthly" },
];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const bnStaticPages = staticPages.map((p) => ({
  ...p,
  loc: p.loc === "/" ? "/bn/" : `/bn${p.loc}`,
}));

function urlLoc(loc: string, slug: string | null) {
  const path = slug ?? loc;
  return `${BASE_URL}/${escapeXml(path)}`;
}

function urlElement(
  loc: string,
  slug: string | null,
  lastmod: string,
  changefreq: string,
  priority: string,
  xhtmlAlt: string | null,
) {
  let el = `  <url>\n    <loc>${urlLoc(loc, slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
  if (xhtmlAlt) el += `\n    ${xhtmlAlt}`;
  return el + `\n  </url>`;
}

function buildUrlEntries(
  pages: typeof staticPages,
  businesses: { slug: string; updated_at: string | null }[],
  ownLang: "en" | "bn",
  altLang: "en" | "bn",
  altBaseLoc: (loc: string) => string,
) {
  const ownPages = ownLang === "bn" ? bnStaticPages : staticPages;
  const entries: string[] = [];

  for (const p of ownPages) {
    const lastmod = TODAY;
    const altLoc = altBaseLoc(p.loc);
    const xhtmlAlt = `<xhtml:link rel="alternate" hreflang="${altLang === "bn" ? "bn-BD" : "en"}" href="${escapeXml(altLoc)}" />`;
    entries.push(urlElement(p.loc, null, lastmod, p.changefreq, p.priority, xhtmlAlt));
  }

  for (const b of businesses) {
    const lastmod = b.updated_at ? new Date(b.updated_at).toISOString().split("T")[0] : TODAY;
    const ownLoc = ownLang === "bn" ? `/bn/${b.slug}` : `/${b.slug}`;
    const altLoc = altBaseLoc(`/${b.slug}`);
    const xhtmlAlt = `<xhtml:link rel="alternate" hreflang="${altLang === "bn" ? "bn-BD" : "en"}" href="${escapeXml(altLoc)}" />`;
    entries.push(urlElement(ownLoc, b.slug, lastmod, "weekly", "0.8", xhtmlAlt));
  }

  return entries;
}

function xmlFor(entries: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
}

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

  const enEntries = buildUrlEntries(staticPages, businesses, "en", "bn", (loc) =>
    loc === "/" ? "/bn/" : `/bn${loc}`
  );
  const bnEntries = buildUrlEntries(bnStaticPages, businesses, "bn", "en", (loc) =>
    loc === "/bn/" ? "/" : loc.slice(3)
  );

  writeFileSync(resolve("public/sitemap.xml"), xmlFor(enEntries));
  writeFileSync(resolve("public/sitemap-bn.xml"), xmlFor(bnEntries));

  console.log(`sitemap.xml written (${staticPages.length + businesses.length} entries with hreflang alternates)`);
  console.log(`sitemap-bn.xml written (${bnStaticPages.length + businesses.length} entries with hreflang alternates)`);
}

main();
