# Scripts

## `generate-pdf.ts` — Lead-Magnet-PDF-Generator

Konvertiert Markdown-Dateien aus `content/lead-magnets/` in gebrandete PDFs unter `public/downloads/`.

### Einmalige Einrichtung

```bash
npm install
npm run pdf:setup       # lädt Chromium für Puppeteer (~170 MB, einmalig)
```

`pdf:setup` ist nur **lokal** nötig. Auf Vercel ist das Download über `.npmrc` deaktiviert, weil das Skript nur lokal läuft.

### PDFs generieren

```bash
# Alle .md-Dateien aus content/lead-magnets/ rendern
npm run pdf

# Nur eine bestimmte Datei
npm run pdf checkliste-ki-praxis
```

Die PDFs landen in `public/downloads/`. Anschließend in Git committen, dann sind sie nach Deploy unter
`https://www.optimazed.de/downloads/<filename>.pdf` verfügbar.

### Neuen Lead-Magnet hinzufügen

1. **Markdown** in `content/lead-magnets/<slug>.md` mit Frontmatter:
   ```yaml
   ---
   title: "Whitepaper: DSGVO-konforme KI für KMU"
   subtitle: "Was 2026 erlaubt ist — und wo Vorsicht gilt."
   filename: "whitepaper-dsgvo-ki.pdf"
   author: "OPTIMAZED"
   ---

   # Einleitung

   …Inhalt als normales Markdown…
   ```

2. **PDF generieren**: `npm run pdf <slug>`

3. **Lead-Magnet registrieren** in `lib/newsletter.ts` unter `LEAD_MAGNETS`:
   ```ts
   lead_magnet_dsgvo_whitepaper: {
     title: 'Whitepaper: DSGVO-konforme KI für KMU',
     url: `${BASE_URL}/downloads/whitepaper-dsgvo-ki.pdf`,
   },
   ```

4. **Form auf einer Seite einbinden** mit `source="lead_magnet_dsgvo_whitepaper"`:
   ```tsx
   <NewsletterSignup
     source="lead_magnet_dsgvo_whitepaper"
     heading="Whitepaper anfordern"
     ctaLabel="Per E-Mail erhalten"
   />
   ```

### Unterstütztes Markdown

Standard-CommonMark plus Tabellen, Strikethrough, Listen, Code-Blöcke, Blockquotes. Bilder funktionieren auch — Pfade
relativ zum Projekt-Root oder absolute URLs.

### Style anpassen

Im HTML-Template (`scripts/generate-pdf.ts` → `htmlTemplate()`) liegt das komplette CSS. Cover-Page, Typografie und
Farben sind dort definiert. Brand-Farben:
- Navy: `#0a1027`
- Accent: `#06b6d4`
