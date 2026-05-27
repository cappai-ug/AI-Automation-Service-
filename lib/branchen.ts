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
    /** Realistische Investitionsspanne, stark volumenabhängig */
    investmentRange: string
    /** Erklärt, wovon die Investition abhängt (Volumen, Tokens, Use Case) */
    investmentNote: string
  }
  /** FAQ branchen-spezifisch */
  faq: Array<{ q: string; a: string }>
  /** Tags für SEO */
  tags: string[]
}

// Gilt für alle Branchen — die Investition ist volumen- und nutzungsabhängig,
// keine festen Pakete. Bewusst transparent statt „ab X €" als Lockangebot.
const SHARED_INVESTMENT_NOTE =
  'Die tatsächliche Investition hängt stark vom Volumen und vom konkreten Use Case ab — es gibt keine festen Pakete. Eine einzelne E-Mail-Triage startet ab ca. 250 €/Monat. Ein KI-Rezeptionist liegt je nach Anrufaufkommen zwischen ca. 500 €/Monat (inkl. 500 Freiminuten, jede weitere Minute ab 30 ct) und 5.000 €+/Monat (inkl. 10.000 Freiminuten). Entscheidend ist die Menge der verarbeiteten Anfragen bzw. Tokens. Im kostenlosen Strategiegespräch kalkulieren wir Ihren konkreten Bedarf realistisch.'

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
          'Ein Erstgespräch vor 12 Monaten, das nie nachgefasst wurde. Ein Mandant, der seit 18 Monaten nichts mehr gehört hat. Jeder verlorene Mandant kostet Jahresumsatz.',
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
        'Eine mittelgroße Steuerkanzlei mit 8 Mitarbeitern, die drei der oben genannten Bausteine einführt:',
      rows: [
        { task: 'KI-Empfangskraft + Mail-Triage', hoursPerMonth: '120 Std.', valuePerMonth: '4.800 €' },
        { task: 'Belegextraktion in DATEV', hoursPerMonth: '60 Std.', valuePerMonth: '3.000 €' },
        { task: 'Recall-Automation (Mehrumsatz)', hoursPerMonth: '—', valuePerMonth: '4.000 €' },
      ],
      totalValuePerMonth: '11.800 €',
      investmentRange: 'ca. 250 € bis 5.000 €+ / Monat',
      investmentNote: SHARED_INVESTMENT_NOTE,
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

  {
    slug: 'zahnarztpraxis',
    short: 'Zahnarztpraxis',
    audience: 'Zahnarztpraxen',
    metaDescription:
      'KI-Automatisierung für Zahnarztpraxen: kein verpasster Anruf mehr, automatisches Recall, weniger No-Shows, Anbindung an DAMPSOFT & CHARLY. DSGVO-konform, Server in der EU.',
    heroLine1: 'KI für Ihre',
    heroAccent: 'Zahnarztpraxis',
    heroLine2: 'die kein Telefonat verpasst.',
    heroSubtext:
      'Ihre Helferin assistiert am Stuhl — und das Telefon klingelt ins Leere. Genau dann ruft der neue Patient an. Wir sorgen dafür, dass jeder Anruf angenommen, jeder Termin gebucht und jeder Recall verschickt wird, ohne dass Ihr Team mehr leisten muss.',
    painPoints: [
      {
        title: 'Jeder dritte Anruf bleibt liegen',
        description:
          'Während der Behandlung kann niemand ans Telefon. Genau dann rufen neue Patienten an — und gehen zur nächsten Praxis. Pro Woche verlieren Sie so mehrere Neupatienten.',
      },
      {
        title: 'Prophylaxe-Patienten verschwinden',
        description:
          'Bis zu 35 % der Recall-Patienten kommen nicht wieder — nicht aus Unzufriedenheit, sondern weil sich niemand gemeldet hat. Jeder davon ist verlorener Stammumsatz.',
      },
      {
        title: 'No-Shows kosten bares Geld',
        description:
          'Ein nicht erschienener Patient bedeutet einen leeren Behandlungsstuhl. Ohne systematische Erinnerungen liegt die No-Show-Quote schnell bei 10–15 %.',
      },
      {
        title: 'Schmerzpatienten richtig einordnen',
        description:
          'Akute Fälle müssen sofort einen Termin bekommen — Routineanfragen können warten. Ohne Triage wird das Lauteste zuerst behandelt, nicht das Dringendste.',
      },
      {
        title: 'Bewertungen passieren nicht von selbst',
        description:
          'Zufriedene Patienten bewerten selten unaufgefordert. Ohne automatische Nachfrage bleiben Google-Bewertungen aus — und neue Patienten finden Sie nicht.',
      },
    ],
    useCases: [
      {
        title: 'KI-Empfang mit Praxissoftware-Anbindung',
        description:
          'Nimmt Anrufe rund um die Uhr an, beantwortet Standardfragen, bucht Termine direkt im Kalender (DAMPSOFT, CHARLY, evident). Schmerzpatienten werden erkannt und priorisiert.',
        saving: '8–12 Std/Woche Empfangszeit',
      },
      {
        title: 'Automatisches Recall-Management',
        description:
          'Patienten ohne Termin in den letzten Monaten bekommen eine persönliche Prophylaxe-Erinnerung — automatisch, aber prüfbar vor Versand. Reaktiviert schlummernde Stammpatienten.',
        saving: '5–8 zusätzliche Termine/Monat',
      },
      {
        title: 'Terminerinnerungen gegen No-Shows',
        description:
          'Automatische Erinnerungen per SMS und E-Mail, im richtigen Abstand. Patienten können direkt verschieben statt einfach nicht zu erscheinen.',
        saving: 'No-Show-Quote bis zu 50 % geringer',
      },
      {
        title: 'Schmerzpatienten-Triage',
        description:
          'Akute Anliegen werden im Gespräch erkannt, bekommen Notfall-Slots angeboten oder werden direkt an die Praxis durchgestellt. Routine wird automatisch eingeplant.',
        saving: 'Mehr Notfälle korrekt versorgt',
      },
      {
        title: 'Bewertungs-Anfragen automatisiert',
        description:
          'Nach dem Termin erhält der zufriedene Patient automatisch eine freundliche Bitte um eine Google-Bewertung. Mehr Sterne = mehr Neupatienten über die Suche.',
        saving: 'Deutlich mehr Google-Bewertungen',
      },
    ],
    exampleCalculation: {
      intro:
        'Eine Praxis mit drei Behandlern und einer Vollzeit-Empfangskraft, die drei Bausteine einführt:',
      rows: [
        { task: 'KI-Empfang (Anrufannahme + Termine)', hoursPerMonth: '40 Std.', valuePerMonth: '2.000 €' },
        { task: 'Recall-Automation (Mehrumsatz)', hoursPerMonth: '16 Std.', valuePerMonth: '3.200 €' },
        { task: 'No-Show-Reduktion', hoursPerMonth: '—', valuePerMonth: '1.800 €' },
      ],
      totalValuePerMonth: '7.000 €',
      investmentRange: 'ca. 500 € bis 5.000 €+ / Monat',
      investmentNote: SHARED_INVESTMENT_NOTE,
    },
    faq: [
      {
        q: 'Funktioniert das mit DAMPSOFT, CHARLY oder evident?',
        a: 'Ja. Wir binden die KI an Ihren bestehenden Praxiskalender an, sodass Termine direkt korrekt eingebucht werden. Welche Software Sie nutzen, klären wir im Erstgespräch.',
      },
      {
        q: 'Merken Patienten, dass sie mit einer KI sprechen?',
        a: 'Die KI klingt natürlich und ist auf Wunsch transparent als Assistenz gekennzeichnet (DSGVO-Hinweis). Bei jedem Wunsch nach einem Menschen wird sofort durchgestellt — niemand bleibt in einer KI-Schleife hängen.',
      },
      {
        q: 'Was ist mit Patientendaten und der Schweigepflicht?',
        a: 'Daten werden auf Servern in der EU verarbeitet, ein Auftragsverarbeitungsvertrag wird geschlossen, keine Patientendaten fließen ins Training. Medizinische Daten unterliegen besonderem Schutz (Art. 9 DSGVO) — entsprechend konfigurieren wir die Lösung.',
      },
      {
        q: 'Wie schnell läuft das?',
        a: 'Erste Komponenten meist in 2–4 Wochen. Wir starten typischerweise mit der Anrufannahme außerhalb der Sprechzeiten und bauen dann aus.',
      },
      {
        q: 'Ersetzt das meine Empfangskraft?',
        a: 'Nein. Es nimmt ihr die Routine ab — verpasste Anrufe, Erinnerungen, Recall —, damit sie sich auf die Patienten vor Ort konzentrieren kann. Das Praxiserlebnis wird besser, nicht unpersönlicher.',
      },
    ],
    tags: ['Zahnarztpraxis', 'Praxis', 'KI-Rezeptionist', 'Recall', 'DAMPSOFT', 'CHARLY'],
  },

  {
    slug: 'rechtsanwaltskanzlei',
    short: 'Rechtsanwaltskanzlei',
    audience: 'Rechtsanwaltskanzleien',
    metaDescription:
      'KI-Automatisierung für Anwaltskanzleien: Mandatsanfragen qualifizieren, Erreichbarkeit sichern, Dokumente strukturieren, Fristen im Blick behalten. DSGVO-konform, Server in der EU.',
    heroLine1: 'KI für Ihre',
    heroAccent: 'Kanzlei',
    heroLine2: 'die keine Mandantenanfrage verliert.',
    heroSubtext:
      'Eine neue Mandatsanfrage, die zwei Tage liegen bleibt, ist meist ein verlorenes Mandat. Wir sorgen dafür, dass jede Anfrage sofort erfasst, qualifiziert und priorisiert wird — und dass Ihr Team sich auf die juristische Arbeit konzentrieren kann, nicht auf das Postfach.',
    painPoints: [
      {
        title: 'Anfragen versanden im Postfach',
        description:
          'Zwischen laufenden Mandaten bleibt die Neuanfrage liegen. Bis jemand reagiert, hat der Interessent längst eine andere Kanzlei beauftragt.',
      },
      {
        title: 'Erreichbarkeit während Terminen',
        description:
          'Wenn Sie im Gericht oder im Mandantengespräch sind, klingelt das Telefon ins Leere. Gerade dringende Anliegen erreichen Sie so nicht.',
      },
      {
        title: 'Unpassende Erstgespräche',
        description:
          'Sie investieren 30 Minuten in ein Erstgespräch — und nach 5 Minuten ist klar: falsches Rechtsgebiet, falsche Erwartung. Diese Zeit fehlt für echte Mandate.',
      },
      {
        title: 'Dokumente manuell erfassen',
        description:
          'Bescheide, Verträge, Schriftsätze: Aktenzeichen, Fristen, Beteiligte werden von Hand ins System übertragen. Fehleranfällig und zeitraubend.',
      },
      {
        title: 'Mandanten fühlen sich uninformiert',
        description:
          'Ohne regelmäßige Status-Updates fragen Mandanten ständig nach — was wiederum Zeit kostet. Ein Teufelskreis.',
      },
    ],
    useCases: [
      {
        title: 'KI-Empfang für die Kanzlei',
        description:
          'Nimmt Anrufe an, auch wenn Sie im Termin sind. Beantwortet organisatorische Fragen, bucht Beratungstermine, erkennt Dringlichkeit und stellt bei Bedarf durch.',
        saving: '8–12 Std/Woche',
      },
      {
        title: 'Mandatsanfragen vorqualifizieren',
        description:
          'Neue Anfragen werden über ein dynamisches Formular nach Rechtsgebiet, Dringlichkeit und Sachverhalt erfasst. Nur passende Mandate landen bei Ihnen — mit Vorab-Briefing.',
        saving: '40+ Std/Jahr eingesparte Erstgespräche',
      },
      {
        title: 'Dokumentenextraktion',
        description:
          'Aus Bescheiden, Verträgen und Schriftsätzen werden Aktenzeichen, Gericht, Fristen und Beteiligte automatisch ausgelesen und der Akte zugeordnet. Sie prüfen nur noch.',
        saving: '60–90 Min/Tag',
      },
      {
        title: 'Fristen-Erinnerung',
        description:
          'Erkannte Fristen werden mit Vorlauf erinnert. Kein verpasster Termin, keine Wiedereinsetzung nötig — die KI behält den Überblick neben dem Fristenkalender.',
        saving: 'Weniger Haftungsrisiko',
      },
      {
        title: 'Automatische Mandanten-Updates',
        description:
          'Bei definierten Ereignissen erhält der Mandant ein verständliches Status-Update. Weniger Nachfragen, zufriedenere Mandanten.',
        saving: 'Spürbar weniger Rückfragen',
      },
    ],
    exampleCalculation: {
      intro:
        'Eine Kanzlei mit drei Anwälten und zwei Mitarbeitenden, die drei Bausteine einführt:',
      rows: [
        { task: 'KI-Empfang + Anfrage-Qualifizierung', hoursPerMonth: '90 Std.', valuePerMonth: '4.500 €' },
        { task: 'Dokumentenextraktion', hoursPerMonth: '50 Std.', valuePerMonth: '2.500 €' },
        { task: 'Schnellere Mandatsannahme (Mehrumsatz)', hoursPerMonth: '—', valuePerMonth: '5.000 €' },
      ],
      totalValuePerMonth: '12.000 €',
      investmentRange: 'ca. 500 € bis 5.000 €+ / Monat',
      investmentNote: SHARED_INVESTMENT_NOTE,
    },
    faq: [
      {
        q: 'Wie steht es um das Mandatsgeheimnis (§ 43a BRAO, § 203 StGB)?',
        a: 'Daten werden auf Servern in der EU verarbeitet, ein Auftragsverarbeitungsvertrag wird geschlossen, keine Mandantendaten fließen ins Training. Für besonders sensible Mandate sind On-Premise-Setups möglich.',
      },
      {
        q: 'Übernimmt die KI rechtliche Bewertungen?',
        a: 'Nein. Die KI übernimmt Organisation, Erfassung und Vorqualifizierung — keine juristische Beratung. Jede rechtliche Einschätzung bleibt beim Anwalt.',
      },
      {
        q: 'Kann ich die Anfrage-Qualifizierung an mein Rechtsgebiet anpassen?',
        a: 'Ja. Das Formular und die Triage-Logik werden auf Ihre Schwerpunkte zugeschnitten — Familienrecht, Arbeitsrecht, Verkehrsrecht etc. erhalten jeweils passende Fragen.',
      },
      {
        q: 'Wie schnell ist das einsatzbereit?',
        a: 'Erste Komponenten in 2–4 Wochen. Wir starten meist mit Erreichbarkeit und Anfrage-Erfassung, dann folgt die Dokumentenextraktion.',
      },
      {
        q: 'Funktioniert das mit RA-MICRO oder advoware?',
        a: 'Wir binden die KI an gängige Kanzleisoftware an. Welche Schnittstellen sinnvoll sind, klären wir im Strategiegespräch anhand Ihres Systems.',
      },
    ],
    tags: ['Rechtsanwaltskanzlei', 'Anwalt', 'Legal Tech', 'Kanzlei', 'RA-MICRO'],
  },

  {
    slug: 'handwerksbetrieb',
    short: 'Handwerksbetrieb',
    audience: 'Handwerksbetriebe',
    metaDescription:
      'KI-Automatisierung für Handwerksbetriebe: Anrufe von der Baustelle aus nicht mehr verpassen, Angebotsanfragen sofort erfassen, Termine koordinieren, Rechnungen automatisieren. DSGVO-konform.',
    heroLine1: 'KI für Ihren',
    heroAccent: 'Handwerksbetrieb',
    heroLine2: 'die ans Telefon geht, wenn Sie es nicht können.',
    heroSubtext:
      'Sie stehen auf der Baustelle, das Telefon klingelt — und der potenzielle Auftrag geht an den Betrieb, der zuerst zurückruft. Wir sorgen dafür, dass jede Anfrage angenommen, qualifiziert und terminiert wird, während Sie arbeiten.',
    painPoints: [
      {
        title: 'Anrufe verpasst, Aufträge verloren',
        description:
          'Auf der Baustelle können Sie nicht ans Telefon. Wer keinen Rückruf bekommt, beauftragt den nächsten Betrieb. Jeder verpasste Anruf kann ein Auftrag im vierstelligen Bereich sein.',
      },
      {
        title: 'Angebote dauern zu lange',
        description:
          'Abends nach Feierabend noch Angebote schreiben — wenn überhaupt Zeit bleibt. Tagelange Verzögerung kostet Aufträge an schnellere Wettbewerber.',
      },
      {
        title: 'Terminchaos zwischen Baustellen',
        description:
          'Aufmaße, Besichtigungen, Folgetermine: ohne System entstehen Doppelbuchungen und Leerfahrten, die Zeit und Sprit kosten.',
      },
      {
        title: 'Rechnungen und Mahnungen bleiben liegen',
        description:
          'Die Arbeit ist gemacht, aber die Rechnung kommt Wochen später — und Mahnungen schreibt niemand gern. Offene Posten häufen sich, der Cash-Flow leidet.',
      },
      {
        title: 'Keine Zeit für Bewertungen',
        description:
          'Zufriedene Kunden bewerten selten von allein. Ohne Nachfrage fehlen die Google-Bewertungen, die neue Kunden überzeugen würden.',
      },
    ],
    useCases: [
      {
        title: 'KI-Telefon für den Betrieb',
        description:
          'Nimmt Anrufe an, während Sie arbeiten. Erfasst, worum es geht, qualifiziert die Anfrage und bietet direkt einen Besichtigungs- oder Rückruftermin an. Notfälle werden durchgestellt.',
        saving: 'Kein verpasster Auftrag mehr',
      },
      {
        title: 'Angebotsanfragen sofort erfassen',
        description:
          'Die KI nimmt alle Eckdaten auf — Gewerk, Umfang, Adresse, Wunschtermin — und bereitet sie strukturiert für Ihr Angebot vor. Sie schreiben das Angebot in Minuten statt am Abend.',
        saving: 'Angebote Tage schneller raus',
      },
      {
        title: 'Terminkoordination',
        description:
          'Aufmaße, Besichtigungen und Folgetermine werden automatisch koordiniert und in Ihren Kalender gebucht — ohne Doppelbuchungen, mit sinnvoller Routenlogik.',
        saving: 'Weniger Leerfahrten',
      },
      {
        title: 'Rechnung & Mahnwesen automatisiert',
        description:
          'Aus erledigten Aufträgen werden Rechnungen erstellt, Zahlungseingänge erkannt und Mahnungen automatisch in Stufen verschickt. Ihre Außenstände sinken spürbar.',
        saving: '2–4 Std/Woche + besserer Cash-Flow',
      },
      {
        title: 'Bewertungs-Anfragen automatisiert',
        description:
          'Nach Abschluss eines Auftrags bittet die KI den Kunden automatisch um eine Google-Bewertung. Mehr Sterne bringen mehr Anfragen über die lokale Suche.',
        saving: 'Mehr lokale Sichtbarkeit',
      },
    ],
    exampleCalculation: {
      intro:
        'Ein Handwerksbetrieb mit Inhaber, vier Gesellen und einer Bürokraft, der drei Bausteine einführt:',
      rows: [
        { task: 'KI-Telefon (Auftragsannahme)', hoursPerMonth: '—', valuePerMonth: '4.000 €' },
        { task: 'Angebots- & Terminkoordination', hoursPerMonth: '50 Std.', valuePerMonth: '2.500 €' },
        { task: 'Rechnung & Mahnwesen', hoursPerMonth: '16 Std.', valuePerMonth: '1.800 €' },
      ],
      totalValuePerMonth: '8.300 €',
      investmentRange: 'ca. 250 € bis 5.000 €+ / Monat',
      investmentNote: SHARED_INVESTMENT_NOTE,
    },
    faq: [
      {
        q: 'Ich bin den ganzen Tag auf der Baustelle — wie funktioniert das?',
        a: 'Genau dafür ist es gebaut. Die KI nimmt Anrufe an, während Sie arbeiten, und schickt Ihnen eine Zusammenfassung jeder Anfrage. Sie rufen nur zurück, wenn es wirklich nötig ist.',
      },
      {
        q: 'Kann die KI verschiedene Gewerke unterscheiden?',
        a: 'Ja. Die Fragen werden auf Ihr Gewerk zugeschnitten — ob Sanitär, Elektro, Maler oder Dachdecker. So kommen die richtigen Eckdaten für Ihr Angebot rein.',
      },
      {
        q: 'Funktioniert das mit meiner Handwerkersoftware?',
        a: 'Wir binden gängige Lösungen für Angebote, Rechnungen und Termine an. Welche Sie nutzen, klären wir im Erstgespräch — meist lässt sich das sauber verbinden.',
      },
      {
        q: 'Was kostet das?',
        a: 'Das hängt stark vom Anrufaufkommen ab. Eine E-Mail-/Angebotsautomatisierung startet ab ca. 250 €/Monat, ein vollwertiges KI-Telefon je nach Volumen ab ca. 500 €/Monat. Im Strategiegespräch rechnen wir Ihren Bedarf konkret durch.',
      },
      {
        q: 'Wie schnell läuft das?',
        a: 'Erste Komponenten meist in 2–4 Wochen. Wir starten oft mit der Anrufannahme, weil dort der größte Hebel liegt.',
      },
    ],
    tags: ['Handwerksbetrieb', 'Handwerk', 'KI-Telefon', 'Auftragsannahme', 'KMU'],
  },
]

export function getBranche(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug)
}

export function getAllBranchen(): Branche[] {
  return BRANCHEN
}
