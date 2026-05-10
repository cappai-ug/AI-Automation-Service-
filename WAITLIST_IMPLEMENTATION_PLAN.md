# Warteliste & Lead Management System - Implementierungsplan

## Überblick
Aus der Warteliste-Form sollen Kontakte erfasst, gepflegt und später in zahlende Kunden konvertiert werden.

---

## ARCHITEKTUR

```
Landing Page Form
      ↓
API Endpoint (/api/waitlist) POST
      ↓
   ├→ Datenbank (PostgreSQL)
   ├→ Email Service (SendGrid/Mailgun)
   ├→ CRM System (optional)
   └→ Analytics (optional)
      ↓
Welcome Email + Demo Link
      ↓
Leads Management Dashboard
      ↓
Sales Conversion
```

---

## PHASE 1: MVP (Wochen 1-2)

### 1. API Endpoint erstellen
**Datei**: `/app/api/waitlist/route.ts`

```typescript
// POST /api/waitlist
// Eingabe: { email, company, useCase }
// Ausgabe: { success, message }

Aufgaben:
- [x] Validierung der Eingabe
- [x] Datenbank-Eintrag erstellen
- [x] Welcome Email versenden
- [x] Error Handling
- [x] Rate Limiting (max 5 pro IP/Stunde)
```

### 2. Datenbank Schema
**Datei**: PostgreSQL/Prisma

```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255),
  useCase TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, demo_sent, customer, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  source VARCHAR(50) DEFAULT 'landing_page'
);

CREATE INDEX idx_email ON waitlist(email);
CREATE INDEX idx_status ON waitlist(status);
CREATE INDEX idx_created_at ON waitlist(created_at DESC);
```

**Prisma Schema** (`prisma/schema.prisma`):
```prisma
model Waitlist {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  company   String?
  useCase   String?
  status    String  @default("new") // new, contacted, demo_sent, customer, rejected
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  notes     String?
  source    String  @default("landing_page")
}
```

### 3. Email Service Setup

**Option A: SendGrid** (empfohlen)
- [x] Registrieren bei SendGrid
- [x] API-Key generieren
- [x] Umgebungsvariable setzen: `SENDGRID_API_KEY`
- [x] Sender-Email verifizieren: `hello@optimized.de` oder ähnlich

**Option B: Mailgun**
- [x] Registrieren
- [x] Domain verifizieren
- [x] API-Key in `.env` speichern

**Umgebungsdatei** (`.env.local`):
```
# Email
SENDGRID_API_KEY=SG.xxxx
SENDGRID_FROM_EMAIL=hello@optimized.de
SENDGRID_FROM_NAME=OPTIMIZED

# Oder Mailgun:
MAILGUN_API_KEY=key-xxxx
MAILGUN_DOMAIN=optimized.de

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/optimized

# Optional: Demo URL
DEMO_BOOKING_URL=https://cal.com/optimized/demo
```

### 4. Welcome Email Template

**Datei**: `/app/api/emails/welcome.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to OPTIMIZED</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px;">
    
    <h1 style="color: #0F172A;">Willkommen bei OPTIMIZED! 🎉</h1>
    
    <p>Hallo {{company}},</p>
    
    <p>Danke, dass Sie sich für OPTIMIZED interessieren. Wir wissen, dass Zeit kostbar ist – deshalb möchten wir Ihnen zeigen, wie einfach KI-Automatisierung für Ihr Unternehmen sein kann.</p>
    
    <h2 style="color: #2563EB;">Die nächsten Schritte:</h2>
    
    <ol>
      <li><strong>Kostenlose Demo (15 Min)</strong><br>
        Sehen Sie live, wie OPTIMIZED funktioniert und wie es zu Ihrem Unternehmen passt.<br>
        <a href="{{demoLink}}" style="background-color: #2563EB; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px 0;">Demo buchen</a>
      </li>
      
      <li><strong>SaaS Plattform testen (kostenlos)</strong><br>
        Beginnen Sie sofort mit der Automatisierung. 14 Tage kostenlos, keine Kreditkarte erforderlich.<br>
        <a href="https://app.optimized.de/signup" style="color: #2563EB; text-decoration: underline;">Jetzt kostenlos starten</a>
      </li>
    </ol>
    
    <h3>Häufig gestellte Fragen:</h3>
    <ul>
      <li><strong>Kostenloses Angebot?</strong> Ja, beide Optionen sind kostenlos für den Anfang.</li>
      <li><strong>DSGVO-konform?</strong> Ja, 100% DSGVO-konform mit Daten in Deutschland.</li>
      <li><strong>Support?</strong> Wir sind per Email und Chat erreichbar (Deutsch sprechend).</li>
    </ul>
    
    <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 20px 0;">
    
    <p style="color: #666; font-size: 12px;">
      Sie möchten nicht diesen Weg gehen? <a href="{{unsubscribeLink}}" style="color: #2563EB;">Hier abmelden</a>
    </p>
    
    <p style="color: #666; font-size: 12px;">
      OPTIMIZED GmbH | hello@optimized.de | www.optimized.de
    </p>
  </div>
</body>
</html>
```

### 5. Implementation des API Endpoints

**Datei**: `/app/api/waitlist/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email, company, useCase } = await req.json();

    // Validierung
    if (!email || !company || !useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Datenbankcheck
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email }
    });

    if (existingEntry) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Sie sind bereits auf unserer Warteliste registriert.',
          status: 'already_exists'
        }
      );
    }

    // Neuer Eintrag
    const entry = await prisma.waitlist.create({
      data: {
        email,
        company,
        useCase,
        status: 'new',
        source: 'landing_page'
      }
    });

    // Demo Link generieren (optional - wenn Sie Cal.com verwenden)
    const demoLink = `${process.env.DEMO_BOOKING_URL}?email=${encodeURIComponent(email)}`;

    // Welcome Email versenden
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Willkommen bei OPTIMIZED – Ihre kostenlose Demo wartet',
      html: `
        <h1>Willkommen bei OPTIMIZED! 🎉</h1>
        <p>Hallo ${company},</p>
        <p>Danke, dass Sie sich für OPTIMIZED interessieren.</p>
        <p><a href="${demoLink}">Demo buchen (15 Min)</a></p>
        <p><a href="https://app.optimized.de/signup">Kostenlos testen</a></p>
      `
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Danke! Sie wurden zur Warteliste hinzugefügt. Check Ihre Email für Ihre Demo-Link.',
        status: 'success'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
```

---

## PHASE 2: Lead Management (Wochen 3-4)

### 1. Dashboard für Lead Management

**Aufgaben:**
- [ ] Admin-Dashboard erstellen (`/admin/leads`)
- [ ] Alle Wartelisten-Einträge anzeigen
- [ ] Filterung: Status, Datum, Unternehmen
- [ ] Bulk-Aktionen: Email versenden, Status ändern
- [ ] Notizen hinzufügen (für Sales-Team)
- [ ] Lead Score berechnen (basierend auf Use Case)

### 2. Automated Follow-up Emails

**Sequenz:**
```
Tag 0: Welcome Email (sofort)
       ↓
Tag 3: "Haben Sie schon eine Demo gebucht?"
       ↓
Tag 7: "Hier sind 3 Erfolgsstories von Unternehmen wie Ihrem"
       ↓
Tag 14: "Spezial: 30 Tage kostenlos (nur für Wartelisten-Mitglieder)"
       ↓
Tag 30: "Letzte Chance: Ihre exklusive Demo-Einladung"
```

**Implementierung:**
- [ ] Scheduled Jobs (Cronjob oder Bull Queue)
- [ ] Email Templates für jeden Step
- [ ] Tracking: "Opened", "Clicked", "Unsubscribed"

### 3. Lead Scoring

**Kriterien:**
```
Company Size:
  - Solo (0 pts) ← -Freelancer
  - 1-5 (5 pts)
  - 5-20 (15 pts)
  - 20+ (10 pts)

Use Case Relevance:
  - Hoch (20 pts) ← "Anrufe, Emails, Rechnungen"
  - Mittel (10 pts) ← "Dokumentation, Reporting"
  - Niedrig (3 pts) ← Vage beschreibung

Email Domain:
  - .de / .at / .ch (10 pts)
  - Business Domain (5 pts)
  - Gmail/Yahoo (-5 pts)

Engagement:
  - Email geöffnet (5 pts)
  - Link geklickt (10 pts)
  - Demo gebucht (50 pts)

Score Kategorien:
  - 60+: "Hot" (kontakt sofort)
  - 30-60: "Warm" (follow-up in 3 Tagen)
  - 0-30: "Cold" (automated sequence)
```

---

## PHASE 3: Konversion (Wochen 5-6)

### 1. Demo Booking System

**Option A: Cal.com** (einfach, kostenlos)
- [ ] Account erstellen
- [ ] Kalender einrichten (Ihre Verfügbarkeit)
- [ ] Booking Link in Emails

**Option B: Calendly** (beliebt)
- [ ] Setup
- [ ] Integration mit CRM

### 2. CRM Integration (optional)

**Wenn Sie Leads in HubSpot/Pipedrive speichern möchten:**

**HubSpot:**
```typescript
const hubspot = require('@hubapi/api-client');

const client = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY
});

// Lead erstellen
await client.crm.contacts.basicApi.create({
  properties: [
    { name: 'firstname', value: company.split(' ')[0] },
    { name: 'company', value: company },
    { name: 'email', value: email },
    { name: 'use_case', value: useCase }
  ]
});
```

### 3. Conversion Tracking

```typescript
// Eintrag als "customer" markieren, wenn:
// - Payment erhalten (Stripe webhook)
// - Demo gebucht
// - Signing up für SaaS

// Webhook from Stripe
POST /api/webhooks/stripe
  → Wartelisten-Status = 'customer'
  → Email: "Willkommen als OPTIMIZED-Kunde"
```

---

## PHASE 4: Analytics & Reporting (Wochen 7-8)

### 1. Metriken tracken

```
Dashboard zeigen:
- Total Wartelisten-Signups: 150
- Conversion Rate: 18% (27 Kunden)
- Avg. Time to Demo: 3.2 Tage
- Avg. Time to Signing: 7.5 Tage
- Top Lead Sources: Landing Page 80%, Referral 15%, Direct 5%
- Top Industries: Ärzte 35%, Anwälte 25%, Agenturen 20%
```

### 2. Tools

- **Analytics**: Mixpanel, Segment, oder simpel mit Datenbank-Queries
- **Email Tracking**: SendGrid bietet builtin tracking
- **Demo Booking**: Cal.com hat eingebautes Analytics

---

## CHECKLISTE FÜR IMPLEMENTIERUNG

### Sofort (Diese Woche):
- [ ] Postgres Datenbank erstellen (lokal oder RDS)
- [ ] Prisma Schema schreiben + Migration
- [ ] SendGrid Account + API Key
- [ ] API Endpoint `/api/waitlist` implementieren
- [ ] Test: Form submission funktioniert
- [ ] Test: Email wird versendet

### Nächste Woche:
- [ ] Admin-Dashboard `/admin/leads`
- [ ] Lead List mit Filterung
- [ ] Manual Email versenden (von Admin)
- [ ] CRM Integration (optional)

### Woche 3:
- [ ] Automated Email Sequences
- [ ] Lead Scoring
- [ ] Demo Booking (Cal.com)

### Woche 4:
- [ ] Conversion Tracking
- [ ] Analytics Dashboard
- [ ] Sales Playbook

---

## DEPLOYMENT

### Umgebungsvariablen setzen (z.B. auf Vercel):

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/optimized

# Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=hello@optimized.de

# Optional
HUBSPOT_API_KEY=xxxxx
STRIPE_SECRET_KEY=sk_xxxxx
DEMO_BOOKING_URL=https://cal.com/optimized/demo
```

### Database Migration:

```bash
npm install @prisma/client
npm run prisma:generate
npm run prisma:migrate
```

### Testing:

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "company": "Test GmbH",
    "useCase": "Rechnungsautomatisierung"
  }'
```

---

## KOSTEN (monatlich)

| Tool | Kosten | Notizen |
|------|--------|---------|
| SendGrid | $15-30 | 100-500k Emails/Monat |
| PostgreSQL (AWS RDS) | $15-50 | t3.small-medium |
| Cal.com | $0 | Kostenlos oder self-hosted |
| Vercel Hosting | $0-20 | Je nach Traffic |
| **Total** | **$30-100** | Skaliert mit Wachstum |

---

## NÄCHSTE SOFORT-SCHRITTE (Heute/Morgen)

1. **Datenbank Setup:**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```

2. **SendGrid Account:**
   - Signup auf sendgrid.com
   - API Key kopieren → `.env.local`

3. **API Endpoint bauen:**
   - Datei erstellen: `/app/api/waitlist/route.ts`
   - Code oben verwenden

4. **Testen:**
   - Form auf Landing Page submitten
   - Check: Datenbank hat Eintrag
   - Check: Email wurde erhalten

5. **Commit & Deploy:**
   - Auf Vercel pushen
   - Environment Variables setzen
   - Live gehen!

---

## Support & Fragen

Wenn Sie unsicher sind:
1. SendGrid Docs: https://sendgrid.com/docs
2. Prisma Docs: https://www.prisma.io/docs
3. Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
