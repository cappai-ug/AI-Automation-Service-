import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsletterSignup from '@/components/NewsletterSignup'
import CalendlyButton from '@/components/CalendlyButton'
import { BRANCHEN, getBranche } from '@/lib/branchen'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return BRANCHEN.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const branche = getBranche(params.slug)
  if (!branche) return {}
  const url = `https://www.optimazed.de/branchen/${branche.slug}`
  return {
    title: `KI für ${branche.audience} | OPTIMAZED`,
    description: branche.metaDescription,
    keywords: branche.tags.join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: `KI für ${branche.audience}`,
      description: branche.metaDescription,
      type: 'website',
      url,
      siteName: 'OPTIMAZED',
      locale: 'de_DE',
    },
  }
}

export default function BranchenPage({ params }: Props) {
  const b = getBranche(params.slug)
  if (!b) notFound()

  const source = `branche_${b.slug}`

  // schema.org Service for SEO
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `KI-Automatisierung für ${b.audience}`,
    description: b.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'OPTIMAZED',
      url: 'https://www.optimazed.de',
    },
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    audience: { '@type': 'BusinessAudience', name: b.audience },
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: b.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main className="bg-white">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section className="bg-gradient-to-br from-navy via-blue-950 to-navy text-white pt-28 pb-20">
        <div className="container-max max-w-5xl">
          <div className="text-sm uppercase tracking-widest text-secondary font-semibold mb-3">
            Für {b.audience}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            {b.heroLine1}{' '}
            <span className="text-secondary">{b.heroAccent}</span>,{' '}
            {b.heroLine2}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl leading-relaxed mb-8">
            {b.heroSubtext}
          </p>
          <div className="flex flex-wrap gap-3">
            <CalendlyButton
              source={source}
              label="Kostenloses Strategiegespräch buchen"
            />
            <Link
              href="#use-cases"
              className="inline-flex items-center justify-center px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Konkrete Anwendungsfälle ansehen ↓
            </Link>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-24 bg-soft-white">
        <div className="container-max max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Kennen Sie das?
          </h2>
          <p className="text-gray-600 mb-12 text-lg">
            Diese fünf Engpässe sehen wir in nahezu jedem Betrieb dieser Branche.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {b.painPoints.map((p) => (
              <div
                key={p.title}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
              >
                <h3 className="font-bold text-navy text-lg mb-2">{p.title}</h3>
                <p className="text-gray-700 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="py-24">
        <div className="container-max max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Was wir konkret automatisieren
          </h2>
          <p className="text-gray-600 mb-12 text-lg">
            Fünf Bausteine, einzeln oder kombiniert einsetzbar. Kein Big-Bang-Projekt.
          </p>
          <div className="space-y-4">
            {b.useCases.map((u, i) => (
              <div
                key={u.title}
                className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-2xl"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy text-xl mb-1">{u.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">{u.description}</p>
                  <div className="inline-block text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-2 py-1 rounded">
                    Ersparnis: {u.saving}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATION */}
      <section className="py-24 bg-soft-white">
        <div className="container-max max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Was bringt das in Euro?
          </h2>
          <p className="text-gray-700 mb-8 text-lg">{b.exampleCalculation.intro}</p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-5 py-3">Baustein</th>
                  <th className="text-left px-5 py-3">Zeit / Monat</th>
                  <th className="text-left px-5 py-3">Wert / Monat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {b.exampleCalculation.rows.map((row) => (
                  <tr key={row.task}>
                    <td className="px-5 py-3 font-medium text-navy">{row.task}</td>
                    <td className="px-5 py-3 text-gray-700">{row.hoursPerMonth}</td>
                    <td className="px-5 py-3 text-gray-700">{row.valuePerMonth}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-5 py-3 text-navy">Summe Mehrwert</td>
                  <td className="px-5 py-3"></td>
                  <td className="px-5 py-3 text-navy">
                    {b.exampleCalculation.totalValuePerMonth}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Investition (stark volumenabhängig)
            </div>
            <div className="text-lg font-semibold text-navy mb-3">
              {b.exampleCalculation.investmentRange}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {b.exampleCalculation.investmentNote}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            Realistische Modellrechnung auf Basis typischer Setups. Konkrete Werte —
            Mehrwert wie Investition — variieren je nach Ausgangslage und Volumen.
          </p>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="py-24">
        <div className="container-max max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
            <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">
              Kostenloser Ratgeber
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
              7 Aufgaben, die KI in Ihrem Betrieb sofort übernehmen kann
            </h2>
            <p className="text-gray-700 mb-6">
              12-seitige Checkliste mit konkreten Zahlen, Beispielrechnung und
              30-Tage-Fahrplan. Sofort als PDF nach Bestätigung.
            </p>
            <NewsletterSignup
              source="lead_magnet_praxis_checklist"
              wrapper="bare"
              theme="light"
              heading=""
              description=""
              consentText="Ich möchte die Checkliste per E-Mail erhalten und abonniere damit den OPTIMAZED-Newsletter (ca. 1 Mail/Woche). Abmeldung jederzeit über den Link in jeder Mail."
              ctaLabel="Checkliste anfordern"
              redirectOnSuccess="lead-magnet"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-soft-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-10">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {b.faq.map((f) => (
              <div
                key={f.q}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <h3 className="font-bold text-navy mb-2">{f.q}</h3>
                <p className="text-gray-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-r from-accent via-blue-600 to-blue-700 text-white">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            30 Minuten, kein Verkaufsdruck.
          </h2>
          <p className="text-lg text-blue-50 mb-8 leading-relaxed">
            Sie schildern Ihren Engpass. Wir sagen Ihnen ehrlich, ob KI dafür die
            richtige Antwort ist — und wenn ja, wie ein erster Schritt aussehen kann.
            Unverbindlich, ohne Folgekontakt-Spam.
          </p>
          <CalendlyButton
            source={source}
            label="Termin buchen"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy hover:bg-gray-100 font-bold rounded-xl text-lg transition-colors shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
