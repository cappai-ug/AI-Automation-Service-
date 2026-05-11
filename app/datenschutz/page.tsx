'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function Datenschutz() {
  return (
    <main className="bg-white">
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-navy mb-8">Datenschutzerklärung</h1>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">1. Verantwortlicher</h2>
                <p>
                  OPTIMAZED GmbH<br />
                  E-Mail: datenschutz@optimazed.de
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
                <p>
                  Wir verarbeiten Ihre Daten ausschließlich zur Erfüllung unserer Geschäftszwecke und zur Verbesserung unserer KI-Automatisierungslösungen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">3. Daten aus der Kontaktform</h2>
                <p>
                  Bei Nutzung unserer Kontaktformulare erfassen wir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>E-Mail-Adresse</li>
                  <li>Firmenname</li>
                  <li>Beschreibung Ihrer Anforderungen</li>
                </ul>
                <p className="mt-4">
                  Diese Daten werden zur Bearbeitung Ihrer Anfrage verwendet und an SendGrid übermittelt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">4. Cookies</h2>
                <p>
                  Wir nutzen Cookies für die Funktionalität unserer Website. Sie können Cookies in Ihrem Browser deaktivieren.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">5. Ihre Rechte</h2>
                <p>
                  Sie haben das Recht auf:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Auskunft über Ihre Daten</li>
                  <li>Berichtigung unrichtiger Daten</li>
                  <li>Löschung Ihrer Daten</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Widerspruch gegen die Verarbeitung</li>
                  <li>Datenportabilität</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">6. Kontakt</h2>
                <p>
                  Für Fragen zum Datenschutz und zur KI-Automatisierung kontaktieren Sie uns unter: datenschutz@optimazed.de
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
