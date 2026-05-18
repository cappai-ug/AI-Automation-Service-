export type Branche = {
  slug: string
  /** Kurzform für H1 und Cards, z.B. "Steuerkanzlei" */
  short: string
  /** Volle Berufsbezeichnung, z.B. "Steuerberatungen" */
  audience: string
  /** Meta-Description / OG */
  metaDescription: string
  /** Hero-Headline mit fett-markierter Phrase */
  heroLine1: string
  heroAccent: string
  heroLine2: string
  /** Hero-Subtext, 1-3 Sätze */
  heroSubtext: string
  /** 3-5 typische Pain-Points dieser Branche */
  painPoints: Array<{ title: string; description: string }>
  /** 3-5 konkrete Use Cases */
  useCases: Array<{
    title: string
    description: string
    saving: string
  }>
  /** Beispielrechnung als Tabellenzeilen */
  exampleCalculation: {
    intro: string
    rows: Array<{ task: string; hoursPerMonth: string; valuePerMonth: string }>
    totalValuePerMonth: string
    investment: string
    netPerMonth: string
  }
  /** FAQ branchen-spezifisch */
  faq: Array<{ q: string; a: string }>
  /** Tags für SEO */
  tags: string[]
}

export const BRANCHEN: Branche[] = [
  {
    slug: 'steuerkanzlei',
    short: 'Steuerkanzlei',
    audience: 'Steuerberatungen',
    metaDescription:
      'KI-Automatisierung für deutsche Steuerkanzleien: weniger E-Mail-Chaos, automatische Belegextraktion in DATEV, schnellere Mandantenantworten. DSGVO-konform, Server in der EU.',
    heroLine1: 'KI für Ihre',
    heroAccent: 'Steuerkanzlei',
    heroLine2: 'die wirklich entlastet.',
    heroSubtext:
      'Sie verbringen Stunden mit Mandanten-E-Mails, Beleg-Tippen und Telefon-Warteschleifen — während die eigentliche Steuerarbeit liegen bleibt. Wir automatisieren genau diese Routine, damit Ihr Team sich auf das konzentriert, was Sie als Kanzlei besonders macht.',
    painPoints: [
      {
        title: 'E-Mail-Flut, die nie endet',
        description:
          'Standardanfragen zu Belegen, Fristen, Statusupdates verbrauchen 3–5 Stunden pro Mitarbeiter — täglich. Die wirklich beratungsintensiven Themen kommen zu kurz.',
      },
      {
        title: 'Mandanten in der Warteschleife',
        description:
          'Wenn alle Sachbearbeiter im Termin sind, bleibt das Telefon einfach liegen. Mandanten fühlen sich nicht ernst genommen — und neue Anfragen landen bei der Konkurrenz.',
      },
      {
        title: 'Belege abtippen statt verbuchen',
        description:
          'Eingangsrechnungen, Quittungen, Kassenbelege werden manuell ins DATEV-System übertragen. Pro Mandant kostet das wertvolle Stunden, die Sie nicht in Rechnung stellen können.',
      },
      {
        title: 'Mandanten verschenken — und es nicht merken',
        description:
          'Ein Erstgespräch vor 12 Monaten, das nie nachgefasst wurde. Ein Mandant, der seit 18 Monaten nichts mehr gehört hat. Jeder verlorene Mandant kostet 3.000–8.000 € Jahresumsatz.',
      },
      {
        title: 'Angebote dauern Tage statt Stunden',
        description:
          'Eine Anfrage am Montag, Antwort am Donnerstag — wenn überhaupt. In dieser Zeit hat der Interessent schon bei zwei anderen Kanzleien angefragt.',
      },
    ],
    useCases: [
      {
        title: 'KI-Empfangskraft mit DATEV-Kalender',
        description:
          'Nimmt Anrufe rund um die Uhr an, beantwortet Standardfragen, bucht Termine direkt im DATEV-Kalender. Notfälle werden an Sie durchgestellt — Routine erledigt sich von selbst.',
        saving: '8–12 Std/Woche',
      },
      {
        title: 'Automatische Belegextraktion → DATEV',
        description:
          'Belege per Mail oder Upload werden automatisch ausgelesen: Betrag, Datum, Lieferant, Steuersatz. Übergabe direkt in DATEV oder lexoffice. Sie prüfen nur noch.',
        saving: '90 Min/Tag pro Sachbearbeiter',
      },
      {
        title: 'Mandanten-Mail-Triage',
        description:
          'KI sortiert eingehende Mails nach Dringlichkeit, schlägt Standard-Antworten vor, eskaliert bei beratungsintensiven Themen. Antwortzeit sinkt von 2 Tagen auf 15 Minuten.',
        saving: '60 Min/Tag pro Mitarbeiter',
      },
      {
        title: 'Mandanten-Recall automatisiert',
        description:
          'Jeder Mandant, der seit X Monaten nichts gehört hat, bekommt eine persönlich klingende Erinnerung — automatisch generiert, vor Versand prüfbar. Aktiviert verlorene Beziehungen.',
        saving: '3–5 zusätzliche Mandate/Quartal',
      },
      {
        title: 'Erstanfragen vorqualifizieren',
        description:
          'Neue Interessenten füllen ein dynamisches Formular aus. Nur passende Anfragen landen bei Ihnen — komplett mit Vorab-Briefing. Erstgespräche werden 30 % effizienter.',
        saving: '40+ Std/Jahr eingesparte Erstgespräche',
      },
    ],
    exampleCalculation: {
      intro:
        'Eine mittelgroße Steuerkanzlei mit 8 Mitarbeitern, die nur drei der oben genannten Bausteine einführt:',
      rows: [
        {
          task: 'KI-Empfangskraft + Mail-Triage',
          hoursPerMonth: '120 Std.',
          valuePerMonth: '4.800 €',
        },
        {
          task: 'Belegextraktion in DATEV',
          hoursPerMonth: '60 Std.',
          valuePerMonth: '3.000 €',
        },
        {
          task: 'Recall-Automation (Mehrumsatz)',
          hoursPerMonth: '—',
          valuePerMonth: '4.000 €',
        },
      ],
      totalValuePerMonth: '11.800 €',
      investment: 'ca. 1.000–1.500 € pro Monat',
      netPerMonth: '~10.000 € Netto-Effekt monatlich',
    },
    faq: [
      {
        q: 'Funktioniert das mit DATEV?',
        a: 'Ja. Wir integrieren über die offiziellen DATEV-Schnittstellen — Belegextraktion, Kalenderanbindung, Mandantenverwaltung. Vorhandene Abläufe bleiben gleich, nur die Zeitfresser verschwinden.',
      },
      {
        q: 'Wer haftet, wenn die KI einen Beleg falsch zuordnet?',
        a: 'Sie. Genau wie heute auch — daher arbeitet die KI als Assistenz, nicht als Endinstanz. Jeder Vorschlag bleibt vor der finalen Buchung prüfbar. Die KI macht den Vorschlag, Ihr Team bestätigt.',
      },
      {
        q: 'Was ist mit der Berufsverschwiegenheit (§ 203 StGB)?',
        a: 'Daten werden auf Servern in der EU verarbeitet, ein Auftragsverarbeitungsvertrag wird mit jedem Kunden geschlossen. Keine Mandantendaten werden zum Training genutzt. Für besonders sensible Mandate können wir auf reine On-Premise-Lösungen ausweichen.',
      },
      {
        q: 'Wie schnell ist das einsatzbereit?',
        a: 'Erste produktive Komponenten typischerweise in 2–4 Wochen. Wir starten klein — eine Aufgabe, ein Pilot — und skalieren erst, wenn der Prozess sauber läuft.',
      },
      {
        q: 'Was, wenn das Team Angst um den Job hat?',
        a: 'Diese Sorge ist berechtigt und ernst zu nehmen. Unsere Erfahrung: KI ersetzt keine Sachbearbeiter, sie ersetzt deren ungeliebte Aufgaben. Das Team wird produktiver und entspannter — wir helfen Ihnen, das auch so zu kommunizieren.',
      },
    ],
    tags: ['Steuerkanzlei', 'Steuerberatung', 'DATEV', 'KI-Steuerberater', 'KMU'],
  },
]

export function getBranche(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug)
}

export function getAllBranchen(): Branche[] {
  return BRANCHEN
}
