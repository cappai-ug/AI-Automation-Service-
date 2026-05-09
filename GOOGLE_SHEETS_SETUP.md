# Google Sheets Integration - Schritt-für-Schritt Anleitung

Diese Anleitung zeigt, wie Sie Google Sheets mit Ihrer Cappai Landing Page verbinden.

## Methode 1: Google Apps Script (Empfohlen für Anfänger)

### Schritt 1: Google Sheet erstellen
1. Gehen Sie zu [Google Sheets](https://sheets.google.com)
2. Klicken Sie auf "Neue Tabelle erstellen"
3. Benennen Sie die Sheet: "Cappai Warteliste"

### Schritt 2: Spalten einrichten
Fügen Sie folgende Spaltenüberschriften ein:
- A1: `Zeitstempel`
- B1: `Email`
- C1: `Unternehmen`
- D1: `Use Case`

### Schritt 3: Apps Script einrichten
1. In der Sheet: Klicken Sie auf "Erweiterungen" > "Apps Script"
2. Löschen Sie den Standardcode
3. Fügen Sie diesen Code ein:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const timestamp = new Date().toLocaleString('de-DE');
    
    sheet.appendRow([
      timestamp,
      data.email,
      data.company,
      data.useCase
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Daten gespeichert'
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Speichern Sie das Script (Strg+S oder Cmd+S)

### Schritt 4: Script bereitstellen
1. Klicken Sie auf "Bereitstellen" (oben rechts)
2. Wählen Sie "Neue Bereitstellung"
3. Wählen Sie den Typ: "Web-App"
4. Geben Sie ein:
   - **Ausführen als**: Ihr Google-Konto
   - **Zugriff**: "Jeder"
5. Klicken Sie auf "Bereitstellen"
6. Sie sehen eine Dialog mit Ihrem Script-URL

### Schritt 5: Script URL kopieren
1. Kopieren Sie die URL aus der Bereitstellungs-Dialog
2. Sie sieht etwa so aus: `https://script.google.com/macros/d/1234567890/usercopy`

### Schritt 6: In der App konfigurieren
1. Erstellen Sie `.env.local` im Projektverzeichnis
2. Fügen Sie ein:
```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/YOUR_ID_HERE/usercopy
```
3. Ersetzen Sie `YOUR_ID_HERE` mit Ihrer echten Script-ID

### Schritt 7: Code aktivieren
1. Öffnen Sie `app/api/waitlist/route.ts`
2. Suchen Sie nach dem Kommentar `// Example: Append to Google Sheets`
3. Uncommentieren Sie die Zeilen

### Schritt 8: Testen
1. Starten Sie die App: `npm run dev`
2. Gehen Sie zu http://localhost:3000
3. Füllen Sie das Wartelisten-Formular aus
4. Sie sollten sehen: "Danke! Sie wurden zur Warteliste hinzugefügt."
5. Überprüfen Sie Ihre Google Sheet - die Daten sollten erscheinen!

## Methode 2: Mit E-Mail Service (Brevo)

Wenn Sie auch automatische E-Mails senden möchten:

1. Erstellen Sie ein Brevo-Konto (ehemals Sendinblue): https://www.brevo.com
2. Erstellen Sie eine Kontaktliste
3. Notieren Sie sich:
   - API-Schlüssel
   - Listen-ID
4. Fügen Sie zu `.env.local` hinzu:
```
BREVO_API_KEY=your_key_here
BREVO_LIST_ID=your_list_id_here
```

## Sicherheit & Best Practices

### ✅ Whitelist konfigurieren
Damit nur Ihre Website Daten abspeichern kann:

1. Öffnen Sie Ihr Apps Script
2. Gehen Sie zu "Projekteinstellungen"
3. Notieren Sie sich die "Script-ID"
4. (Optional) Implementieren Sie einen Geheimschlüssel im Script:

```javascript
function doPost(e) {
  const secret = 'YOUR_SECRET_KEY';
  
  // Überprüfen Sie den geheimen Schlüssel
  if (e.parameters.secret && e.parameters.secret[0] === secret) {
    // Verarbeiten Sie die Anfrage
  } else {
    return ContentService.createTextOutput('Unauthorized')
      .setHttpResponseCode(401);
  }
}
```

### ✅ DSGVO-Compliance
- Alle Daten sind anonym gespeichert
- Benutzer akzeptieren die Datenschutzerklärung
- Implementieren Sie eine Löschanfrage-Funktion

### ✅ Rate Limiting
Fügen Sie zu `.env.local` hinzu:
```
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=3600
```

## Troubleshooting

### "Script execution timed out"
- Die Apps Script ist zu langsam
- Überprüfen Sie, ob andere Scripts parallel laufen
- Optimieren Sie den Code

### "Unauthorized" Error
- Script-URL ist falsch
- Überprüfen Sie, ob das Script in allen Bereichen erreichbar ist

### Daten erscheinen nicht in der Sheet
- Überprüfen Sie, dass Sie "Jeder" ausgewählt haben
- Aktualisieren Sie die Seite (F5)
- Überprüfen Sie die Browser Console auf Fehler (F12)

## Weitere Ressourcen

- [Google Apps Script Dokumentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [DSGVO Compliance](https://gdpr-info.eu/)

## Support

Bei Fragen: info@cappai-ug.de
