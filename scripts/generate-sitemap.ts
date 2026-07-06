// Runs before `vite dev` and `vite build`; writes public/sitemap.xml with banglahq.com URLs.
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

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

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

  const staticUrls = staticPages.map(
    (p) => `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  );

  const bizUrls = businesses.map((b) => {
    const lastmod = b.updated_at ? new Date(b.updated_at).toISOString().split("T")[0] : TODAY;
    return `  <url>
    <loc>${BASE_URL}/${escape(b.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...bizUrls].join("\n")}
</urlset>
`;

  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${staticPages.length + businesses.length} entries)`);
}

main();
