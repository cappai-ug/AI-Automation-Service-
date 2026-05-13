# Lead-Magnet-Dateien

Dieser Ordner enthält die per Newsletter-Anmeldung ausgelieferten PDFs.

## Aktive Lead-Magnete

| Source-Slug | Dateiname (erwartet) | Titel |
|---|---|---|
| `lead_magnet_praxis_checklist` | `checkliste-ki-praxis.pdf` | Checkliste: 7 Aufgaben, die KI in Ihrer Praxis sofort übernehmen kann |

Die Slug→Datei-Zuordnung ist in `lib/newsletter.ts` unter `LEAD_MAGNETS`.

## Neuen Lead-Magnet hinzufügen

1. PDF in diesen Ordner legen, z.B. `whitepaper-dsgvo-ki.pdf`
2. In `lib/newsletter.ts` einen neuen Eintrag in `LEAD_MAGNETS`:
   ```ts
   lead_magnet_dsgvo_whitepaper: {
     title: 'Whitepaper: DSGVO-konforme KI für KMU',
     url: `${BASE_URL}/downloads/whitepaper-dsgvo-ki.pdf`,
   },
   ```
3. Neue Section/Form auf einer passenden Seite mit `source="lead_magnet_dsgvo_whitepaper"`.
