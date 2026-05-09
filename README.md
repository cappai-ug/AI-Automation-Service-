# Cappai - KI-Automatisierung für deutsche Unternehmen

Professionelle Landing Page mit Waitlist-Verwaltung und vollständiger Einhaltung deutscher Rechtsvorschriften.

## Features

- ✅ **Modernes Landing Page Design** - Responsive, schnell, konvertierungsoptimiert
- ✅ **Hybrid Service Model** - Managed Services + SaaS Platform
- ✅ **Wartelist-System** - Email + Company + Use Case Collection
- ✅ **Vollständige deutsche Rechtskompliance**:
  - Impressum (Legal Notice)
  - Datenschutzerklärung (Privacy Policy - DSGVO konform)
  - AGB (Terms of Service)
  - Cookie-Richtlinie (Cookie Policy)
- ✅ **Cookie Consent Banner** - DSGVO-konform
- ✅ **SEO optimiert** - Meta tags, strukturierte Daten
- ✅ **Mobile Responsive** - Tailwind CSS
- ✅ **TypeScript** - Type-safe development

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Deployment**: Vercel / Netlify ready

## Installation

```bash
# Install dependencies
npm install

# Create environment file (optional, for Google Sheets integration)
cp .env.example .env.local

# Run development server
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.

## Google Sheets Integration für Warteliste

### Option 1: Google Sheets mit Apps Script (Empfohlen)

1. **Google Sheet erstellen**:
   - Neue Google Sheet unter https://sheets.google.com erstellen
   - Spalten hinzufügen: `Zeitstempel`, `Email`, `Unternehmen`, `Use Case`

2. **Apps Script einrichten**:
   - In der Sheet: Erweiterungen > Apps Script
   - Folgenden Code einfügen:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date().toISOString(),
    data.email,
    data.company,
    data.useCase
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Script deployen**:
   - Speichern > Bereitstellen > Neue Bereitstellung
   - Typ: Web-App
   - Ausführen als: Ihr Account
   - Zugriff: Jeder
   - Deploy-URL kopieren (z.B. `https://script.google.com/macros/d/...`)

4. **In der App einrichten**:
   - `GOOGLE_SCRIPT_URL` in `.env.local` setzen
   - In `app/api/waitlist/route.ts` den Code uncommentieren

### Option 2: Google Sheets API

1. **Service Account erstellen** unter [Google Cloud Console](https://console.cloud.google.com)
2. **Sheets API aktivieren**
3. **Credentials als JSON speichern**
4. **Umgebungsvariablen setzen**:
```
GOOGLE_SHEETS_API_KEY=...
SPREADSHEET_ID=...
```

## Deployment

### Vercel (Empfohlen für Next.js)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy
```

### Eigener Server

```bash
npm run build
npm start
```

## Verzeichnisstruktur

```
/app
  /api
    /waitlist          # Waitlist Form Handler
  /components
    CookieBanner.tsx   # DSGVO Cookie Consent
    Header.tsx         # Navigation
    Footer.tsx         # Footer mit Links
    WaitlistForm.tsx   # Waitlist Form
  /datenschutz         # Privacy Policy
  /agb                 # Terms of Service
  /impressum           # Legal Notice
  /cookie-richtlinie   # Cookie Policy
  page.tsx             # Home Page
  layout.tsx           # Root Layout
  globals.css          # Global Styles
```

## Umgebungsvariablen

Erstellen Sie `.env.local`:

```env
# Google Sheets Integration (optional)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/...

# Oder Google Sheets API
GOOGLE_SHEETS_API_KEY=...
SPREADSHEET_ID=...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=...
```

## Anpassungen

### Farben ändern
In `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#YOUR_COLOR',
    600: '#YOUR_COLOR',
    // ...
  }
}
```

### Geschäftsinformationen aktualisieren
1. `components/Footer.tsx` - Kontaktdaten
2. `app/impressum/page.tsx` - Geschäftsdetails
3. `app/datenschutz/page.tsx` - Datenschutzverantwortlicher

### Preise anpassen
In `app/page.tsx` - Pricing Section aktualisieren

## Browser-Unterstützung

- Chrome/Edge (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Performance

- Lighthouse Score: 90+
- Core Web Vitals optimiert
- Image Optimization included
- Minified CSS/JS

## Sicherheit

- ✅ HTTPS ready
- ✅ DSGVO konform
- ✅ XSS Protection
- ✅ CSRF Protection (Next.js default)
- ✅ Input Validation
- ✅ Secure Headers

## Support

Bei Fragen zur Webseite kontaktieren:
- **Email**: info@cappai-ug.de
- **Adresse**: Freiherr-vom-Stein-Str 14a, 61440 Oberursel

## Lizenz

© 2024 Cappai UG (haftungsbeschränkt). Alle Rechte vorbehalten.
