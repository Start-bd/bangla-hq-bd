import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://banglahq.com";

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, updated_at")
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/directory", priority: "0.9", changefreq: "daily" },
    { loc: "/startups", priority: "0.8", changefreq: "weekly" },
    { loc: "/pricing", priority: "0.7", changefreq: "monthly" },
    { loc: "/tools", priority: "0.6", changefreq: "monthly" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
  ];

  const urls = staticPages
    .map(
      (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .concat(
      (businesses ?? []).map(
        (b) => `  <url>
    <loc>${SITE}/${b.slug}</loc>
    <lastmod>${new Date(b.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
    );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});
