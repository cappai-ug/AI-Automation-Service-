import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CalendlyButton from '@/components/CalendlyButton'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt | OPTIMAZED',
  description:
    'Sprechen Sie mit uns über KI-Automatisierung für Ihren Betrieb. Strategiegespräch buchen, schreiben oder anrufen — wir antworten innerhalb von 24 Stunden.',
  alternates: { canonical: 'https://www.optimazed.de/kontakt' },
}

export default function KontaktPage() {
  return (
    <main className="bg-white">
      <Header />

      <section className="bg-gradient-to-br from-navy via-blue-950 to-navy text-white pt-32 pb-20">
        <div className="container-max max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Sprechen wir <span className="text-secondary">über Ihr Projekt</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            Drei Wege, uns zu erreichen. Wählen Sie, was am schnellsten zum Ziel führt.
            Wir antworten innerhalb von 24 Stunden.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {/* Calendly card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center flex flex-col">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-xl font-bold text-navy mb-2">Strategiegespräch buchen</h2>
              <p className="text-sm text-gray-600 mb-6 flex-1">
                30 Minuten, unverbindlich. Wir schauen Ihre größten Engpässe an und sagen
                ehrlich, was sich mit KI lohnt.
              </p>
              <CalendlyButton
                source="kontakt_page"
                label="Termin buchen"
                className="inline-flex items-center justify-center px-5 py-3 bg-accent hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors w-full"
              />
            </div>

            {/* Email card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center flex flex-col">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-xl font-bold text-navy mb-2">E-Mail schreiben</h2>
              <p className="text-sm text-gray-600 mb-6 flex-1">
                Lieber asynchron? Schreiben Sie uns kurz, worum es geht — wir melden uns
                noch heute oder spätestens am nächsten Werktag.
              </p>
              <a
                href="mailto:hello@optimazed.de"
                className="inline-flex items-center justify-center px-5 py-3 bg-navy hover:bg-blue-900 text-white font-semibold rounded-xl transition-colors w-full"
              >
                hello@optimazed.de
              </a>
            </div>

            {/* Address card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center flex flex-col">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-xl font-bold text-navy mb-2">Postanschrift</h2>
              <p className="text-sm text-gray-700 mb-6 flex-1 leading-relaxed">
                Cappai UG (haftungsbeschränkt)
                <br />
                Freiherr-vom-Stein-Str 14a
                <br />
                61440 Oberursel
                <br />
                Deutschland
              </p>
              <a
                href="/impressum"
                className="inline-flex items-center justify-center px-5 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors w-full"
              >
                Impressum ansehen
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-soft-white rounded-2xl border border-gray-200 p-8 sm:p-10 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
              Oder schicken Sie uns eine Nachricht
            </h2>
            <p className="text-gray-600 mb-6">
              Wir melden uns innerhalb von 24 Stunden zurück. Ihre Daten werden ausschließlich
              zur Beantwortung Ihrer Anfrage verwendet.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
