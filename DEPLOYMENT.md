# Deployment Guide - Cappai Landing Page

Vollständige Anleitung zum Deployen Ihrer Cappai Landing Page.

## Übersicht

Sie haben folgende Optionen:

| Option | Kosten | Setup-Zeit | Best für |
|--------|--------|-----------|---------|
| **Vercel** (Empfohlen) | Kostenlos/ab $20/Monat | 2 Minuten | Production Ready |
| **Netlify** | Kostenlos/ab $19/Monat | 2 Minuten | Static Sites |
| **Eigener Server** | Abhängig | 30+ Minuten | Volle Kontrolle |

## Option 1: Vercel Deployment (Empfohlen) ⭐

### Schritt 1: GitHub Repository verbinden
```bash
git remote add github https://github.com/YOUR_USERNAME/cappai-landing.git
git push github claude/german-ai-landing-page-zVIsh
```

### Schritt 2: Bei Vercel registrieren
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie "Sign Up"
3. Melden Sie sich mit GitHub an

### Schritt 3: Projekt importieren
1. Klicken Sie auf "New Project"
2. Wählen Sie Ihr GitHub Repository
3. Vercel erkennt automatisch "Next.js"
4. Klicken Sie "Deploy"

### Schritt 4: Umgebungsvariablen konfigurieren (Optional)
1. Gehen Sie zu Project Settings > Environment Variables
2. Fügen Sie hinzu:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/.../usercopy
   ```
3. Speichern und neu deployen

### Schritt 5: Domain konfigurieren (Optional)
1. Gehen Sie zu Project > Domains
2. Fügen Sie Ihre Domain hinzu
3. Folgen Sie der DNS-Konfiguration

**Deployment abgeschlossen in ~3 Minuten! 🎉**

---

## Option 2: Netlify Deployment

### Schritt 1: Projekt klonen/pushen
```bash
git remote add netlify https://github.com/YOUR_USERNAME/cappai-landing.git
git push netlify claude/german-ai-landing-page-zVIsh
```

### Schritt 2: Bei Netlify registrieren
1. Gehen Sie zu [netlify.com](https://netlify.com)
2. Klicken Sie "Sign Up"
3. Melden Sie sich mit GitHub an

### Schritt 3: Projekt verbinden
1. Klicken Sie "Add new site" > "Import an existing project"
2. Wählen Sie Ihr GitHub Repository
3. Build Einstellungen:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Klicken Sie "Deploy site"

### Schritt 4: Umgebungsvariablen konfigurieren
1. Gehen Sie zu Site settings > Build & Deploy > Environment
2. Fügen Sie Ihre Variablen hinzu
3. Neu deployen

---

## Option 3: Eigener Server (VPS/Root Server)

### Anforderungen
- Node.js 18+
- npm oder yarn
- Linux Server (Ubuntu 22.04 empfohlen)
- Domain mit DNS-Zugriff

### Schritt 1: Server-Setup
```bash
# SSH in Ihren Server
ssh root@your-server.com

# Updates
apt update && apt upgrade -y

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Git installieren
apt install -y git
```

### Schritt 2: Projekt klonen
```bash
cd /var/www
git clone <REPO_URL> cappai
cd cappai
npm install
```

### Schritt 3: Build
```bash
npm run build
```

### Schritt 4: Mit PM2 starten (Prozessmanager)
```bash
npm install -g pm2
pm2 start "npm start" --name cappai
pm2 startup
pm2 save
```

### Schritt 5: Nginx konfigurieren
```bash
apt install -y nginx
```

Erstellen Sie `/etc/nginx/sites-available/cappai`:
```nginx
server {
    listen 80;
    server_name cappai-ug.de www.cappai-ug.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktivieren Sie die Konfiguration:
```bash
ln -s /etc/nginx/sites-available/cappai /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Schritt 6: SSL Certificate (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d cappai-ug.de -d www.cappai-ug.de
```

---

## Post-Deployment Checkliste

### ✅ Funktionalität testen
- [ ] Homepage lädt
- [ ] Alle Links funktionieren
- [ ] Wartelisten-Formular funktioniert
- [ ] Cookie-Banner erscheint
- [ ] Rechtliche Seiten funktionieren

### ✅ Sicherheit
- [ ] HTTPS aktiviert
- [ ] Security Headers konfiguriert
- [ ] Umgebungsvariablen gespeichert (nicht in .git!)
- [ ] CORS richtig konfiguriert

### ✅ SEO
- [ ] Meta-Tags überprüft
- [ ] robots.txt vorhanden
- [ ] sitemap.xml erstellt
- [ ] Google Search Console registriert

### ✅ Performance
- [ ] Lighthouse Score überprüfen
- [ ] Core Web Vitals überprüfen
- [ ] Pagespeed Insights prüfen
- [ ] Images optimiert

### ✅ Google Sheets Integration
- [ ] Google Sheets erstellt
- [ ] Apps Script bereitgestellt
- [ ] GOOGLE_SCRIPT_URL in Umgebung
- [ ] Test-Eintrag abschicken

### ✅ Analytics (Optional)
- [ ] Google Analytics einrichten
- [ ] GA4-ID in Umgebung
- [ ] Facebook Pixel (falls gewünscht)

---

## Domains verbinden

### DNS Einträge für Ihre Domain

Wenn Sie cappai-ug.de verwenden, aktualisieren Sie DNS-Einträge:

**Für Vercel:**
```
CNAME    www    cname.vercel-dns.com
CNAME    @      cappai-ug.vercel.app
```

**Für Netlify:**
```
CNAME    www    your-site.netlify.app
CNAME    @      your-site.netlify.app
```

**Für eigenen Server:**
```
A        @      YOUR_SERVER_IP
A        www    YOUR_SERVER_IP
```

---

## Updates und Wartung

### Update durchführen
```bash
git pull origin claude/german-ai-landing-page-zVIsh
npm install
npm run build

# Bei Vercel/Netlify: Automatisch nach Push
# Bei eigener Server: 
pm2 restart cappai
```

### Logs überprüfen
```bash
# Vercel: Dashboard
# Netlify: Site settings > Deploys
# PM2: pm2 logs cappai
```

---

## Troubleshooting

### Website zeigt "Not Found"
- [ ] Überprüfen Sie den Domain/DNS
- [ ] Leeren Sie den Browser-Cache (Ctrl+Shift+Del)
- [ ] Warten Sie 24h für DNS-Propagation

### Form sendet keine Daten
- [ ] GOOGLE_SCRIPT_URL richtig gespeichert?
- [ ] Apps Script ist bereitgestellt?
- [ ] Überprüfen Sie Browser Console (F12)

### Langsame Performance
- [ ] Vercel Analytics überprüfen
- [ ] Bilder optimieren
- [ ] CDN Cache überprüfen

### SSL Certificate Fehler
- [ ] Let's Encrypt erneuern: `certbot renew`
- [ ] Nginx neu starten: `systemctl restart nginx`

---

## Support

Bei Problemen kontaktieren Sie:
- **Email**: info@cappai-ug.de
- **Dokumentation**: README.md
- **Google Sheets Setup**: GOOGLE_SHEETS_SETUP.md

---

## Nächste Schritte

Nach dem Deployment:

1. **Analytics einrichten** - Google Analytics + Search Console
2. **Email-Automatisierung** - Brevo/SendGrid für Wartelisten-Emails
3. **A/B Testing** - Landings Page optimieren
4. **Content Marketing** - Blog starten
5. **Social Media** - Links teilen

Viel Erfolg! 🚀
