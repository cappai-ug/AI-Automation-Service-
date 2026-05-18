import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BRANCHEN } from '@/lib/branchen'

export const metadata: Metadata = {
  title: 'KI-Lösungen nach Branche | OPTIMAZED',
  description:
    'KI-Automatisierung speziell für Ihre Branche — Steuerkanzleien, Praxen, Kanzleien, Handwerk. Konkrete Anwendungsfälle, realistische Zahlen, kostenloses Strategiegespräch.',
  alternates: { canonical: 'https://www.optimazed.de/branchen' },
}

export default function BranchenIndexPage() {
  return (
    <main className="bg-white">
      <Header />

      <section className="bg-gradient-to-br from-navy via-blue-950 to-navy text-white pt-32 pb-20">
        <div className="container-max max-w-5xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            KI für Ihre <span className="text-secondary">Branche</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            Jede Branche hat eigene Engpässe. Wir zeigen Ihnen konkret, was bei Ihnen
            sinnvoll ist — und was nicht.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {BRANCHEN.map((b) => (
              <Link
                key={b.slug}
                href={`/branchen/${b.slug}`}
                className="group block bg-soft-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-accent transition-all"
              >
                <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
                  Für {b.audience}
                </div>
                <h2 className="text-2xl font-bold text-navy mb-3 group-hover:text-accent transition-colors">
                  KI für die {b.short}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {b.metaDescription}
                </p>
                <div className="text-sm font-semibold text-accent group-hover:underline">
                  Anwendungsfälle ansehen →
                </div>
              </Link>
            ))}
          </div>
          {BRANCHEN.length < 4 && (
            <p className="text-center text-gray-500 mt-10 text-sm">
              Weitere Branchen folgen. Ihr Bereich nicht dabei? Schreiben Sie uns
              an{' '}
              <a href="mailto:hello@optimazed.de" className="text-accent hover:underline">
                hello@optimazed.de
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
