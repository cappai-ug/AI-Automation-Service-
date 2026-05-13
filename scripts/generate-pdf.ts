/**
 * Lead-Magnet-PDF-Generator.
 *
 * Reads a Markdown file from content/lead-magnets/<slug>.md with frontmatter,
 * renders it through an OPTIMAZED-branded HTML template, and emits a PDF to
 * public/downloads/<filename>.pdf via headless Chromium.
 *
 * Usage:
 *   npm run pdf                          → builds every .md in content/lead-magnets
 *   npm run pdf checkliste-ki-praxis     → builds just that one
 *
 * Requirements:
 *   • Local install. Puppeteer auto-downloads Chromium on first install (~170 MB).
 *   • If install was run with PUPPETEER_SKIP_DOWNLOAD, run once locally:
 *       node node_modules/puppeteer/install.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { marked } from 'marked'
import puppeteer from 'puppeteer'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'lead-magnets')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'downloads')

type Frontmatter = {
  title: string
  subtitle?: string
  filename?: string
  author?: string
  year?: string | number
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function htmlTemplate(meta: Frontmatter, contentHtml: string): string {
  const title = escapeHtml(meta.title)
  const subtitle = meta.subtitle ? escapeHtml(meta.subtitle) : ''
  const year = meta.year ?? new Date().getFullYear()
  const author = meta.author ?? 'OPTIMAZED'

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 22mm 18mm 22mm 18mm; }
    @page :first { margin: 0; }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0a1027;
      line-height: 1.6;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Cover page */
    .cover {
      page-break-after: always;
      height: 297mm;
      width: 210mm;
      background: linear-gradient(135deg, #0a1027 0%, #1e3a8a 60%, #0a1027 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30mm 22mm;
      position: relative;
      overflow: hidden;
    }
    .cover::after {
      content: '';
      position: absolute;
      right: -60mm;
      bottom: -60mm;
      width: 200mm;
      height: 200mm;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 60%);
    }
    .cover-brand {
      font-size: 14pt;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #06b6d4;
      text-transform: uppercase;
    }
    .cover-tag {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.45);
      border-radius: 999px;
      color: #06b6d4;
      font-size: 10pt;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 18px;
    }
    .cover-title {
      font-size: 34pt;
      font-weight: 900;
      line-height: 1.15;
      margin: 0 0 18px 0;
      color: white;
      max-width: 150mm;
      position: relative;
      z-index: 1;
    }
    .cover-subtitle {
      font-size: 14pt;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
      max-width: 140mm;
      position: relative;
      z-index: 1;
    }
    .cover-meta {
      font-size: 10pt;
      color: rgba(255, 255, 255, 0.7);
      position: relative;
      z-index: 1;
    }
    .cover-meta strong { color: white; font-weight: 600; }

    /* Content */
    h1 {
      font-size: 22pt;
      font-weight: 800;
      color: #0a1027;
      margin: 0 0 14px 0;
      line-height: 1.25;
    }
    h2 {
      font-size: 16pt;
      font-weight: 700;
      color: #0a1027;
      margin: 28px 0 10px 0;
      padding-top: 10px;
      border-top: 2px solid #06b6d4;
      page-break-after: avoid;
    }
    h3 {
      font-size: 12pt;
      font-weight: 700;
      color: #0a1027;
      margin: 18px 0 6px 0;
      page-break-after: avoid;
    }
    p { margin: 0 0 10px 0; }
    strong { color: #0a1027; font-weight: 700; }
    ul, ol { margin: 6px 0 12px 0; padding-left: 22px; }
    li { margin-bottom: 4px; }
    li::marker { color: #06b6d4; font-weight: 700; }

    blockquote {
      margin: 14px 0;
      padding: 12px 16px;
      background: #f4f9fb;
      border-left: 4px solid #06b6d4;
      color: #334155;
      font-style: italic;
    }

    code {
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 3px;
      font-family: "SF Mono", Menlo, Consolas, monospace;
      font-size: 9.5pt;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    thead { background: #0a1027; color: white; }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 22px 0;
    }

    a { color: #06b6d4; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .callout {
      background: linear-gradient(135deg, #f4f9fb 0%, #e9f5f9 100%);
      border: 1px solid #c2eaf3;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0;
    }

    /* Avoid orphans/widows */
    p, li { orphans: 3; widows: 3; }
  </style>
</head>
<body>
  <section class="cover">
    <div>
      <div class="cover-brand">${escapeHtml(author).toUpperCase()}</div>
    </div>
    <div>
      <div class="cover-tag">Kostenloser Ratgeber</div>
      <h1 class="cover-title">${title}</h1>
      ${subtitle ? `<p class="cover-subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="cover-meta">
      <strong>${escapeHtml(author)}</strong> · KI-Automatisierung für deutsche KMU · ${year}<br>
      www.optimazed.de
    </div>
  </section>

  <section class="content">
    ${contentHtml}
  </section>
</body>
</html>`
}

async function renderToPdf(slug: string) {
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Markdown-Datei nicht gefunden: ${mdPath}`)
  }

  const raw = fs.readFileSync(mdPath, 'utf8')
  const { data, content } = matter(raw)
  const meta = data as Frontmatter

  if (!meta.title) {
    throw new Error(`Frontmatter "title" fehlt in ${mdPath}`)
  }

  const contentHtml = marked.parse(content, { async: false }) as string
  const html = htmlTemplate(meta, contentHtml)

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const outPath = path.join(OUTPUT_DIR, meta.filename ?? `${slug}.pdf`)

  console.log(`→ ${slug}: Rendering ${meta.title}…`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="font-size: 8pt; color: #94a3b8; width: 100%; padding: 0 18mm; display: flex; justify-content: space-between;">
          <span>www.optimazed.de</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
    })
  } finally {
    await browser.close()
  }

  console.log(`  ✓ ${outPath}`)
}

async function main() {
  const args = process.argv.slice(2)
  let slugs: string[]
  if (args.length > 0) {
    slugs = args.map((a) => a.replace(/\.md$/, ''))
  } else {
    if (!fs.existsSync(CONTENT_DIR)) {
      console.error(`Inhaltsverzeichnis fehlt: ${CONTENT_DIR}`)
      process.exit(1)
    }
    slugs = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''))
  }

  if (slugs.length === 0) {
    console.log('Keine .md-Dateien in content/lead-magnets/ gefunden.')
    return
  }

  for (const slug of slugs) {
    try {
      await renderToPdf(slug)
    } catch (err: any) {
      console.error(`✗ ${slug}: ${err.message}`)
      process.exitCode = 1
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
