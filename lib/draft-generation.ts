import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { getAnthropic, DRAFT_MODEL } from './anthropic'

// Structured output schema — Claude must return JSON matching this shape.
export const DraftSchema = z.object({
  title: z
    .string()
    .min(20)
    .max(120)
    .describe('SEO-optimierter Titel auf Deutsch, max 120 Zeichen.'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .min(5)
    .max(80)
    .describe('URL-Slug: nur Kleinbuchstaben, Zahlen und Bindestriche.'),
  description: z
    .string()
    .min(80)
    .max(280)
    .describe('Meta-Description, 80–280 Zeichen.'),
  category: z
    .enum(['ratgeber', 'branchen', 'technologie'])
    .describe('Beste Kategorie für den Artikel.'),
  tags: z
    .array(z.string().min(2).max(40))
    .min(2)
    .max(6)
    .describe('2–6 prägnante Tags.'),
  content_markdown: z
    .string()
    .min(1500)
    .describe(
      'Vollständiger Artikel als Markdown (ohne Frontmatter), mind. 800 Wörter, mit H2/H3, Listen und einem Fazit.'
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

const SYSTEM_PROMPT = `Du bist Chefredakteur des OPTIMAZED-Blogs.

ÜBER OPTIMAZED
- Anbieter von KI-Automatisierung für deutsche kleine und mittlere Unternehmen.
- Zielgruppe: Inhaber und Entscheider in Arztpraxen, Anwaltskanzleien, Steuerberatungen, Handwerksbetrieben, Agenturen.
- Kernprodukte: KI-Rezeptionist, E-Mail-Automatisierung, Lead-Qualifizierung.
- USP: DSGVO-konform, Server in Deutschland (AWS Frankfurt), keine Trainingsnutzung von Kundendaten.

DEINE AUFGABE
Du bekommst ein aktuelles Branchen-Nachrichten-Item (Titel, Beschreibung, Link). Verfasse darauf basierend einen eigenständigen Blogartikel, der OPTIMAZEDs Audience hilft.

KEINE EINFACHE ZUSAMMENFASSUNG: nutze das Item nur als Aufhänger. Der Artikel muss konkrete praktische Erkenntnisse für KMU-Entscheider bringen.

REGELN
- Sprache: Deutsch, "Sie"-Form, professionell aber zugänglich.
- Stil: konkret, beispielreich, keine Werbephrasen, keine Floskeln wie "in der heutigen schnelllebigen Zeit".
- Länge: 800–1.500 Wörter im Markdown-Body.
- Struktur: einleitender Hook, 3–6 H2-Sektionen, optional H3-Unterabschnitte, am Ende ein Fazit.
- Listen, Tabellen, konkrete Zahlen wo sinnvoll.
- Keine direkten Zitate aus der Quelle. Keine Bilder einbetten.
- Verlinke OPTIMAZED nicht plump. Wenn sinnvoll, erwähne in 1–2 Sätzen, wie OPTIMAZED bei dem Thema hilft — nie als Hauptthema.

RELEVANZ-EINSCHÄTZUNG
Im "relevance_score" gibst du an, wie gut das Thema zur OPTIMAZED-Zielgruppe passt:
- 9–10: Perfekt (KI im KMU, Automatisierung, DSGVO, Branchen-Workflows)
- 6–8: Gut anschließbar (allgemeine Digitalisierung, Recht für KMU)
- 3–5: Schwacher Bezug (allgemeine Tech-News)
- 1–2: Irrelevant (Consumer-Tech, Politik, Gaming)

Auch bei niedrigem Score: liefere trotzdem einen brauchbaren Artikel ab. Das Redaktionsteam entscheidet, ob er publiziert wird.

KATEGORIE-ZUORDNUNG
- "ratgeber": How-to, Checklisten, allgemeine KMU-Tipps
- "branchen": Branchenspezifische Anwendungsfälle (Praxis, Kanzlei, Handwerk, etc.)
- "technologie": KI-Hintergründe, DSGVO, Tech-Trends, AI Act

SLUG-REGELN
- Nur Kleinbuchstaben, Zahlen, Bindestriche
- 3–6 bedeutungstragende Wörter
- Keine Stop-Wörter wie "der", "die", "und"
- Beispiel: "ki-rezeptionist-arztpraxis-spart-zeit"`

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
    'Schreibe darauf basierend einen eigenständigen Blogartikel gemäß den Regeln.',
  ].filter(Boolean)
  return lines.join('\n')
}

export async function generateDraftFromItem(item: FeedItemInput): Promise<Draft> {
  const client = getAnthropic()

  // messages.parse() validates against the Zod schema and returns parsed_output.
  // claude-opus-4-7: adaptive thinking only, no temperature/top_p/top_k, no budget_tokens.
  // System prompt is cached (prefix is byte-stable across all draft generations).
  const response = await client.messages.parse({
    model: DRAFT_MODEL,
    max_tokens: 16_000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'medium',
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

  if (!response.parsed_output) {
    throw new Error(`Claude returned no parsed output (stop_reason: ${response.stop_reason})`)
  }
  return response.parsed_output
}
