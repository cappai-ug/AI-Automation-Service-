import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { getAnthropic } from './anthropic'

// Minimum score (inclusive) required to send an item to the expensive Opus draft generation.
export const MIN_RELEVANCE_SCORE = 6

// Cheap, fast pre-screening model. ~200× cheaper than Opus per token.
const SCORING_MODEL = 'claude-haiku-4-5'

// Items that mention any of these keywords (case-insensitive, word-aware) get
// short-circuited as irrelevant without spending a Haiku call. Kept tight — for
// gray-area items, let Haiku decide.
const KEYWORD_BLACKLIST: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b(gaming|playstation|xbox|nintendo|steam-?deck|konsole)\b/i, reason: 'keyword:gaming' },
  { pattern: /\b(bundesliga|fußball|olympia|champions league|formel 1|nba|nfl)\b/i, reason: 'keyword:sport' },
  { pattern: /\b(bitcoin|ethereum|krypto|nft|altcoin|memecoin|defi)\b/i, reason: 'keyword:crypto' },
  { pattern: /\b(netflix|disney\+|prime video|kinostart|filmkritik|serien-review)\b/i, reason: 'keyword:entertainment' },
  { pattern: /\b(iphone|samsung galaxy|pixel \d|wearable test|smartwatch test)\b/i, reason: 'keyword:consumer_hardware' },
  { pattern: /\b(promi|celebrity|royal|gala|skandal)\b/i, reason: 'keyword:tabloid' },
]

export function applyKeywordFilter(item: {
  title: string
  description: string | null
}): string | null {
  const haystack = `${item.title}\n${item.description ?? ''}`
  for (const { pattern, reason } of KEYWORD_BLACKLIST) {
    if (pattern.test(haystack)) return reason
  }
  return null
}

// Structured output: Claude returns an array of { id, score, reason, topic_cluster }.
const ScoredItemSchema = z.object({
  id: z
    .string()
    .describe('Die ID des bewerteten Items, exakt wie im Input übergeben.'),
  score: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe('Relevanz für OPTIMAZED-Audience: 1=irrelevant, 10=perfekter Fit.'),
  reason: z
    .string()
    .min(3)
    .max(150)
    .describe('Kurze deutsche Begründung, max 12 Wörter.'),
  topic_cluster: z
    .string()
    .min(2)
    .max(60)
    .describe(
      'Themen-Kennung als slug (kleinbuchstaben, bindestriche), z.B. "ki-arztpraxis", "dsgvo-update", "ai-act". Items zum gleichen Thema müssen denselben Cluster bekommen.'
    ),
})
const ScoreResultSchema = z.object({
  items: z.array(ScoredItemSchema),
})

const SCORING_SYSTEM_PROMPT = `Du bewertest RSS-Nachrichten-Items für ihre Relevanz zur OPTIMAZED-Audience.

OPTIMAZED bietet KI-Automatisierung für deutsche kleine und mittlere Unternehmen — Arztpraxen, Anwaltskanzleien, Steuerberatungen, Handwerk, Agenturen. Kernthemen: KI-Rezeptionist, E-Mail-Automatisierung, Lead-Qualifizierung, DSGVO, AI Act.

Du erhältst eine Liste von Items (id, title, description). Für jedes Item gib einen Score 1–10 und eine kurze Begründung.

SCORING-SKALA
- 9–10: Perfekter Fit. KI/Automatisierung im KMU, DSGVO-Compliance, AI Act, Branchen-Workflows der Zielgruppe.
- 6–8: Gut anschließbar. Allgemeine Digitalisierung im Mittelstand, IT-Recht für KMU, Branchen-Trends.
- 3–5: Schwacher Bezug. Allgemeine Tech-News ohne KMU-Bezug, Konzern-News, Enterprise-IT.
- 1–2: Irrelevant. Consumer-Tech, Politik, Unterhaltung, Gaming, Sport, Krypto.

WICHTIG
- Sei streng. Lieber 5 als 7, wenn unsicher.
- Wenn ein Item nur tangential mit KI zu tun hat, aber für ein DE-KMU keinen praktischen Nutzen hat: max 5.
- Begründung max 12 Wörter, auf Deutsch.

TOPIC-CLUSTER (für Duplikat-Erkennung)
Vergib pro Item eine kompakte Themen-Kennung als slug — kleinbuchstaben, bindestrich-getrennt, 2–4 Wörter. Items zum gleichen Thema MÜSSEN dieselbe Kennung bekommen, damit wir Duplikate erkennen.

Beispiele für gute Cluster:
- "ki-arztpraxis" (Anwendungsfälle für Praxen)
- "ki-anwaltskanzlei"
- "ki-steuerberatung"
- "ki-handwerk"
- "dsgvo-update" (neue DSGVO-Urteile / -Hinweise)
- "ai-act" (EU AI Act Themen)
- "ki-rezeptionist" (Telefon-KI)
- "email-automatisierung"
- "rechnungsbearbeitung"
- "ki-recruiting"
- "deepfake-betrug"
- "datenleck"
- "claude-update", "openai-update" (KI-Anbieter-News)
- "generative-ki-allgemein"
- "klein-irrelevant" (für sehr unspezifische Items)

Lieber etwas weniger granular, damit zwei Artikel über dieselbe Nachricht (z.B. ein neues DSGVO-Urteil aus zwei Quellen) gleich gruppiert werden. Aber granular genug, dass z.B. "KI in der Arztpraxis" und "KI in der Anwaltskanzlei" nicht denselben Cluster bekommen.

OUTPUT
Gib ein JSON-Objekt mit "items"-Array zurück, eines pro Input-Item, in der gleichen Reihenfolge. Die "id" muss exakt mit der übergebenen ID übereinstimmen.`

export type ItemToScore = {
  id: string
  title: string
  description: string | null
  sourceName: string
}

export type ScoredItem = z.infer<typeof ScoredItemSchema>

export async function scoreItemsWithHaiku(
  items: ItemToScore[]
): Promise<Map<string, { score: number; reason: string; topicCluster: string }>> {
  if (items.length === 0) return new Map()

  const client = getAnthropic()

  const userPrompt = [
    'Bewerte die folgenden Items:',
    '',
    ...items.map((it, i) =>
      [
        `--- Item ${i + 1} ---`,
        `id: ${it.id}`,
        `Quelle: ${it.sourceName}`,
        `title: ${it.title}`,
        `description: ${(it.description ?? '').slice(0, 400)}`,
      ].join('\n')
    ),
  ].join('\n')

  const response = await client.messages.parse({
    model: SCORING_MODEL,
    max_tokens: 4_000,
    output_config: {
      format: zodOutputFormat(ScoreResultSchema, { name: 'scored_items' }),
    },
    system: [
      {
        type: 'text',
        text: SCORING_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  })

  if (!response.parsed_output) {
    throw new Error(`Haiku scorer returned no parsed output (stop_reason: ${response.stop_reason})`)
  }

  const map = new Map<string, { score: number; reason: string; topicCluster: string }>()
  for (const scored of response.parsed_output.items) {
    map.set(scored.id, {
      score: scored.score,
      reason: scored.reason,
      topicCluster: normalizeCluster(scored.topic_cluster),
    })
  }
  return map
}

/**
 * Normalize a Haiku-emitted cluster slug so equal topics consistently
 * compare equal even if Haiku varies casing or punctuation.
 */
export function normalizeCluster(input: string): string {
  return input
    .toLowerCase()
    .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' })[c] ?? c)
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * Jaccard similarity on lowercased, stop-word-filtered tokens of length ≥3.
 * 0 = no overlap, 1 = identical bag of significant words.
 */
const STOP_WORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einem', 'einen', 'eines',
  'und', 'oder', 'aber', 'mit', 'ohne', 'für', 'fuer', 'gegen', 'auf', 'von', 'zu', 'zur', 'zum',
  'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'wurde', 'wurden',
  'mehr', 'sehr', 'doch', 'nur', 'auch', 'schon', 'bereits',
  'dass', 'wenn', 'weil', 'damit', 'als', 'wie', 'was', 'wer', 'wo', 'warum',
  'hier', 'dort', 'man', 'sich', 'beim', 'vom', 'im', 'am',
  'this', 'that', 'with', 'from', 'into', 'have', 'has', 'had', 'will', 'are', 'and', 'the', 'for',
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' })[c] ?? c)
      .replace(/ß/g, 'ss')
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  )
}

export function titleSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a)
  const tokensB = tokenize(b)
  if (tokensA.size === 0 || tokensB.size === 0) return 0
  let intersection = 0
  for (const t of tokensA) if (tokensB.has(t)) intersection += 1
  const union = tokensA.size + tokensB.size - intersection
  return intersection / union
}
