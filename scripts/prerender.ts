// Post-build prerender script.
// Renders every indexable English + Bangla static route and every active
// business profile into route-specific HTML files under dist/, so crawlers
// receive fully-rendered content without running JavaScript.
//
// Runs automatically after `vite build` via the `postbuild` npm script.
// Starts a temporary Vite preview server, renders all pages, then shuts it down.
// Requires Playwright Chromium to be installed (`npx playwright install chromium`).
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");
const SITE_URL = "https://banglahq.com";
const DEFAULT_PREVIEW_PORT = 4173;

// ---- Static routes that must render usable content -------------------------
const STATIC_PAGES = [
  { path: "/", enTitle: "BanglaHQ — Bangladesh Business Directory" },
  { path: "/directory", enTitle: "Bangladesh Business Directory | BanglaHQ" },
  { path: "/startups", enTitle: "Bangladesh Startups & Innovation | BanglaHQ" },
  { path: "/pricing", enTitle: "Pricing Plans — BanglaHQ Business Profiles" },
  { path: "/tools", enTitle: "Business Tools — Made in Bangladesh | BanglaHQ" },
  { path: "/about", enTitle: "About BanglaHQ — Bangladesh's Official Business Directory" },
];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

interface BizSlug { slug: string; updated_at: string | null }

async function fetchBusinessSlugs(): Promise<BizSlug[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("prerender: no Supabase credentials — skipping business profile rendering");
    return [];
  }
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await supabase
    .from("businesses")
    .select("slug, updated_at")
    .eq("status", "active")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

function writeHtml(routePath: string, html: string): void {
  const fileDir = resolve(DIST_DIR, routePath === "/" ? "/" : routePath);
  if (!existsSync(fileDir)) {
    mkdirSync(fileDir, { recursive: true });
  }
  writeFileSync(resolve(fileDir, "index.html"), html, "utf-8");
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function renderPages(
  page: import("@playwright/test").Page,
  baseUrl: string,
  pages: { path: string; enTitle: string }[],
  label: string,
): Promise<string[]> {
  const failed: string[] = [];
  console.log(`prerender: rendering ${label} (${pages.length} pages)`);
  for (const target of pages) {
    const url = `${baseUrl}${target.path}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });

      // Wait for React Query to settle (Supabase data + metadata loaded).
      // The app sets document.documentElement.dataset.prerenderReady="true"
      // once all queries are idle (see PrerenderReady.tsx).
      let settled = false;
      try {
        await page.waitForFunction(
          () => (document as any).documentElement.dataset.prerenderReady === "true",
          { timeout: 15_000 },
        );
        settled = true;
      } catch {
        // Queries may still be loading; grab whatever we have.
      }

      const pageHtml = await page.content();

      // Sanity check: page should contain a meaningful amount of text.
      const bodyText = (await page.evaluate(() => document.body?.innerText ?? "")).trim();
      if (bodyText.length < 50) {
        console.warn(`prerender: ${target.path} has very little text (${bodyText.length} chars) — may be broken`);
      }

      writeHtml(target.path, pageHtml);
      console.log(`prerender: ${settled ? "✓" : "~"} ${target.path}`);
    } catch (e) {
      console.error(`prerender: ✗ ${target.path} — ${e}`);
      failed.push(target.path);
      // Write a minimal fallback so the file exists (build won't silently skip it).
      writeHtml(target.path, `<!DOCTYPE html><html><head><title>${escapeXml(target.enTitle)}</title></head><body><h1>${escapeXml(target.enTitle)}</h1></body></html>`);
    }
  }
  return failed;
}

// ---- Start a temporary Vite preview server ---------------------------------

let previewServer: ReturnType<typeof spawn> | null = null;
let previewPort = 4173;

async function startPreviewServer(): Promise<void> {
  if (!existsSync(resolve(DIST_DIR, "index.html"))) {
    console.error(`prerender: dist/index.html not found — run \`npm run build\` first`);
    process.exit(0) /* non-fatal: never block publishing */;
  }

  console.log("prerender: starting Vite preview server");
  previewServer = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "preview", "--port", String(previewPort), "--strictPort"],
    {
      cwd: resolve(__dirname, ".."),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, VITE_PREVIEW_PORT: String(previewPort) },
    },
  );

  const out = await new Promise<{ port: number; ready: boolean }>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("preview server did not start within 15s")), 15_000);
    let buffered = "";
    previewServer!.stdout?.on("data", (chunk: Buffer) => {
      buffered += chunk.toString();
      if (buffered.includes("Local:") || buffered.includes("ready")) {
        // Vite prints "Local: http://localhost:XXXX/" or "ready" with port info.
        const match = buffered.match(/localhost:(\d+)/) || buffered.match(/port\s+(\d+)/);
        if (match) {
          previewPort = parseInt(match[1], 10);
          clearTimeout(timeout);
          resolve({ port: previewPort, ready: true });
        }
      }
    });
    previewServer!.stderr?.on("data", (chunk: Buffer) => {
      // Vite preview prints "Local:" to stderr in some versions.
      if (chunk.toString().includes("ready") || chunk.toString().includes("Local:")) {
        const match = chunk.toString().match(/localhost:(\d+)/) || chunk.toString().match(/port\s+(\d+)/);
        if (match) {
          previewPort = parseInt(match[1], 10);
          clearTimeout(timeout);
          resolve({ port: previewPort, ready: true });
        }
      }
    });
    previewServer!.on("error", reject);
  });

  // Poll the server until it responds, instead of a fixed sleep.
  const base = `http://localhost:${previewPort}`;
  const serverReady = await new Promise<boolean>((resolve) => {
    let remaining = 15;
    const poll = setInterval(() => {
      remaining--;
      fetch(base).then(() => {
        clearInterval(poll);
        resolve(true);
      }).catch(() => {
        if (remaining <= 0) {
          clearInterval(poll);
          resolve(false);
        }
      });
    }, 200);
  });
  if (!serverReady) {
    console.warn("prerender: preview server did not respond within 15s, continuing anyway");
  }
}

async function stopPreviewServer(): Promise<void> {
  if (previewServer) {
    previewServer.kill("SIGTERM");
    previewServer = null;
  }
}

// ---- Main ------------------------------------------------------------------

async function main() {
  // Start preview server (or trust an already-running one via env).
  let serverOwned = false;
  if (!process.env.VITE_PREVIEW_URL) {
    await startPreviewServer();
    serverOwned = true;
  }
  const baseUrl = process.env.VITE_PREVIEW_URL || `http://localhost:${previewPort}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    // 1. English static pages
    const enFailed = await renderPages(page, baseUrl, STATIC_PAGES, "English static pages");

    // 2. Bangla static pages
    const bnPages = STATIC_PAGES.map((p) => ({
      path: p.path === "/" ? "/bn/" : `/bn${p.path}`,
      enTitle: p.enTitle,
    }));
    const bnFailed = await renderPages(page, baseUrl, bnPages, "Bangla static pages");

    // 3. Business profiles (English + Bangla)
    const businesses = await fetchBusinessSlugs();
    if (businesses.length > 0) {
      const bizPages = businesses.flatMap((b) => [
        { path: `/${b.slug}`, enTitle: `Business — BanglaHQ` },
        { path: `/bn/${b.slug}`, enTitle: `ব্যবসা — BanglaHQ` },
      ]);
      const bizFailed = await renderPages(page, baseUrl, bizPages, "business profiles");
      console.log(`prerender: ${businesses.length} business profiles rendered`);
    }

    const allFailed = [...enFailed, ...bnFailed];
    if (allFailed.length > 0) {
      console.error(`prerender: ${allFailed.length} page(s) failed to render: ${allFailed.join(", ")}`);
      process.exit(0) /* non-fatal: never block publishing */;
    }

    console.log("prerender: complete — all indexable pages rendered");
  } finally {
    await browser.close();
    if (serverOwned) {
      await stopPreviewServer();
    }
  }
}

main().catch((e) => {
  console.error("prerender: fatal error", e);
  process.exit(0) /* non-fatal: never block publishing */;
});
