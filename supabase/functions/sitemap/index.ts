import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const SITE = "https://banglahq.com";
const TODAY = new Date().toISOString().split("T")[0];

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, updated_at, name_en, logo_url, cover_url")
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

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  const staticUrls = staticPages.map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  const bizUrls = (businesses ?? []).map((b: any) => {
    const lastmod = b.updated_at ? new Date(b.updated_at).toISOString().split("T")[0] : TODAY;
    const images: string[] = [];
    if (b.logo_url) images.push(b.logo_url);
    if (b.cover_url) images.push(b.cover_url);
    const imageXml = images
      .map(
        (u) => `    <image:image>
      <image:loc>${escape(u)}</image:loc>
      <image:title>${escape(b.name_en ?? b.slug)}</image:title>
    </image:image>`
      )
      .join("\n");
    return `  <url>
    <loc>${SITE}/${escape(b.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageXml ? "\n" + imageXml : ""}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticUrls, ...bizUrls].join("\n")}
</urlset>`;

  const headers = new Headers();
  headers.set("Content-Type", "application/xml; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(xml, { status: 200, headers });
});
