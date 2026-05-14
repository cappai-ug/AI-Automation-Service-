import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { getAnthropic, DRAFT_MODEL } from './anthropic'

// Structured output schema — Claude must return JSON matching this shape.
// Length/regex constraints are validated client-side; Anthropic's structured-outputs
// API does not enforce minLength/maxLength/pattern in the schema sent to Claude.
// Keep the floors generous (don't reject perfectly good content) but assert structure.
export const DraftSchema = z.object({
  title: z
    .string()
    .min(15)
    .max(150)
    .describe('SEO-optimierter Titel auf Deutsch, max 120 Zeichen.'),
  slug: z
    .string()
    .min(5)
    .max(100)
    .describe('URL-Slug: nur Kleinbuchstaben, Zahlen und Bindestriche.'),
  description: z
    .string()
    .min(50)
    .max(400)
    .describe('Meta-Description, 80–280 Zeichen.'),
  category: z
    .enum(['ratgeber', 'branchen', 'technologie'])
    .describe('Beste Kategorie für den Artikel.'),
  tags: z
    .array(z.string().min(2).max(60))
    .min(2)
    .max(10)
    .describe('3–8 prägnante Tags.'),
  content_markdown: z
    .string()
    .min(3000)
    .describe(
      'Vollständiger Artikel als Markdown (ohne Frontmatter). Mindestens 1.800 Wörter (ca. 8.000–14.000 Zeichen). Struktur: einleitender Hook, 5–8 H2-Hauptsektionen mit substantiellem Inhalt, H3-Unterabschnitte wo sinnvoll, konkrete Beispiele, Listen/Tabellen, abschließendes Fazit.'
    ),
  relevance_score: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe(
      'Wie gut passt das Thema zur OPTIMAZED-Zielgruppe (deutsche KMU, KI-Automatisierung)? 1=irrelevant, 10=perfekt.'
    ),
})

export type Draft = z.infer<typeof DraftSchema>

const SYSTEM_PROMPT = `Du bist Chefredakteur des OPTIMAZED-Blogs und schreibst tiefgründige Pillar-Artikel.

ÜBER OPTIMAZED
- Anbieter von KI-Automatisierung für deutsche kleine und mittlere Unternehmen.
- Zielgruppe: Inhaber und Entscheider in Arztpraxen, Anwaltskanzleien, Steuerberatungen, Handwerksbetrieben, Agenturen.
- Kernprodukte: KI-Rezeptionist, E-Mail-Automatisierung, Lead-Qualifizierung.
- USP: DSGVO-konform, Server in Deutschland (AWS Frankfurt), keine Trainingsnutzung von Kundendaten.

DEINE AUFGABE
Du bekommst ein aktuelles Branchen-Nachrichten-Item (Titel, Beschreibung, Link). Verfasse darauf basierend einen eigenständigen, ausführlichen Blog-Artikel mit echtem Mehrwert für KMU-Entscheider.

KEINE EINFACHE ZUSAMMENFASSUNG. Nutze das Item nur als Aufhänger und liefere danach Tiefe: Hintergründe, konkrete Beispiele, Handlungsempfehlungen, Branchen-Bezug. Schreibe als wärst du ein Fachmagazin-Autor, nicht als Bot.

REGELN
- Sprache: Deutsch, "Sie"-Form, professionell aber zugänglich. Keine Floskeln wie "in der heutigen schnelllebigen Zeit".
- **Länge: mindestens 1.800 Wörter, optimal 2.200–2.800 Wörter.** Schreibe vollständig durch, schneide nicht ab. Lieber ein klares Fazit am Ende als ein offenes Ende.
- Struktur:
  1. Hook-Einleitung (2–3 Absätze): warum das Thema jetzt relevant ist, was der Leser mitnimmt
  2. 5–8 H2-Sektionen mit jeweils mehreren Absätzen Inhalt
  3. H3-Unterabschnitte wo eine H2 in mehrere Aspekte zerfällt
  4. Listen, Tabellen, konkrete Zahlen wo es Sinn ergibt — aber nicht künstlich
  5. Mindestens 1 Beispiel-Szenario aus einer Zielbranche (z.B. "Eine Steuerkanzlei in Köln…")
  6. Abschluss: prägnantes Fazit mit den 2–3 wichtigsten Take-aways
- Inhaltlich:
  - Konkret statt abstrakt: Zahlen, Prozesse, Tool-Namen, Branchen-Begriffe
  - Wenn rechtliche Themen: DSGVO, AI Act, BDSG korrekt einordnen
  - Wenn technisch: erklären statt Buzzwords
  - Keine direkten Zitate aus der Quelle (Copyright)
- OPTIMAZED-Erwähnung: in 1–2 Sätzen, dezent, an passender Stelle (z.B. unter einer "So lösen Sie das"-Sektion). Niemals als Hauptthema, kein "Werbeflyer".
- Keine Bilder einbetten, keine externen Links zur Quelle.

RELEVANZ-EINSCHÄTZUNG
Im "relevance_score" gibst du an, wie gut das Thema zur OPTIMAZED-Zielgruppe passt:
- 9–10: Perfekt (KI im KMU, Automatisierung, DSGVO, Branchen-Workflows)
- 6–8: Gut anschließbar (allgemeine Digitalisierung, Recht für KMU)
- 3–5: Schwacher Bezug (allgemeine Tech-News)
- 1–2: Irrelevant (Consumer-Tech, Politik, Gaming)

Auch bei niedrigem Score: liefere trotzdem einen vollständigen, ausführlichen Artikel ab. Das Redaktionsteam entscheidet über Veröffentlichung.

KATEGORIE-ZUORDNUNG
- "ratgeber": How-to, Checklisten, allgemeine KMU-Tipps
- "branchen": Branchenspezifische Anwendungsfälle (Praxis, Kanzlei, Handwerk, etc.)
- "technologie": KI-Hintergründe, DSGVO, Tech-Trends, AI Act

SLUG-REGELN
- Nur Kleinbuchstaben, Zahlen, Bindestriche
- 3–6 bedeutungstragende Wörter
- Keine Stop-Wörter wie "der", "die", "und"
- Beispiel: "ki-rezeptionist-arztpraxis-spart-zeit"

WICHTIG ZUM ABSCHLUSS
Bevor du das JSON ausgibst, prüfe selbst: Ist der Artikel mindestens 1.800 Wörter lang? Hat er ein klares Fazit? Wenn nein, schreibe weiter, bis er es ist. Ein abgeschnittener Artikel ist nutzlos.`

type FeedItemInput = {
  title: string
  link: string
  description: string | null
  contentSnippet: string | null
  sourceName: string
  categoryHint?: string | null
}

function buildUserPrompt(item: FeedItemInput): string {
  const lines = [
    `Quelle: ${item.sourceName}`,
    item.categoryHint ? `Kategorie-Hinweis der Quelle: ${item.categoryHint}` : null,
    `Titel: ${item.title}`,
    `Link: ${item.link}`,
    item.description ? `Beschreibung: ${item.description}` : null,
    item.contentSnippet && item.contentSnippet !== item.description
      ? `Zusatz: ${item.contentSnippet.slice(0, 1500)}`
      : null,
    '',
    'Schreibe darauf basierend einen vollständigen, ausführlichen Blogartikel (mindestens 1.800 Wörter) gemäß den Regeln. Liefere ausschließlich das fertige JSON-Objekt zurück.',
  ].filter(Boolean)
  return lines.join('\n')
}

export async function generateDraftFromItem(item: FeedItemInput): Promise<Draft> {
  const client = getAnthropic()

  // claude-opus-4-7: adaptive thinking only, no temperature/top_p/top_k, no budget_tokens.
  // Streaming required for max_tokens > ~16K to avoid SDK HTTP timeouts.
  // System prompt is cached so repeated drafts hit the prompt cache.
  const stream = client.messages.stream({
    model: DRAFT_MODEL,
    max_tokens: 64_000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: zodOutputFormat(DraftSchema, { name: 'blog_draft' }),
    },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserPrompt(item) }],
  })

  const finalMessage = await stream.finalMessage()

  if (finalMessage.stop_reason === 'max_tokens') {
    throw new Error(
      'Claude reached max_tokens before finishing the draft. Consider raising max_tokens or lowering effort.'
    )
  }
  if (finalMessage.stop_reason === 'refusal') {
    throw new Error('Claude refused to write the draft for safety reasons.')
  }

  // The structured-output text block contains the JSON.
  let raw: string | null = null
  for (const block of finalMessage.content) {
    if (block.type === 'text') {
      raw = block.text
      break
    }
  }
  if (!raw) {
    throw new Error(`No text block returned (stop_reason: ${finalMessage.stop_reason})`)
  }

  let parsed: any
  try {
    parsed = JSON.parse(raw)
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from Claude: ${err.message}. Raw (first 200 chars): ${raw.slice(0, 200)}`)
  }

  // Normalize the slug — Claude doesn't always emit URL-safe output.
  if (typeof parsed?.slug === 'string') {
    parsed.slug = parsed.slug
      .toLowerCase()
      .replace(/[äöü]/g, (c: string) => ({ ä: 'ae', ö: 'oe', ü: 'ue' })[c] ?? c)
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  }

  try {
    return DraftSchema.parse(parsed)
  } catch (err: any) {
    const issues = err?.issues
      ? err.issues
          .map((i: any) => `${i.path?.join('.') || '?'}: ${i.message}`)
          .join('; ')
      : err?.message
    throw new Error(`Draft validation failed: ${issues}`)
  }
}
