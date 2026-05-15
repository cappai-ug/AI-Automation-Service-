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
            <h1 className="text-4xl font-bold text-navy mb-2">Datenschutzerklärung</h1>
            <p className="text-sm text-gray-500 mb-8">Stand: Mai 2026</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">1. Verantwortlicher</h2>
                <p>
                  Cappai UG (haftungsbeschränkt)<br />
                  Freiherr-vom-Stein-Str 14a<br />
                  61440 Oberursel<br />
                  Deutschland<br />
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
                  Diese Daten werden zur Bearbeitung Ihrer Anfrage verwendet und an SendGrid (Twilio Inc., USA — EU-US Data Privacy Framework, AVV abgeschlossen) übermittelt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">4. Cookies</h2>
                <p>
                  Wir nutzen Cookies für die Funktionalität unserer Website. Sie können Cookies in Ihrem Browser deaktivieren.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">5. Newsletter und Lead-Magnete</h2>
                <p>
                  Wenn Sie sich für unseren Newsletter anmelden oder eine Checkliste/ein Whitepaper anfordern, verarbeiten wir Ihre E-Mail-Adresse (und falls von Ihnen angegeben Ihren Namen) zum Zweck des Versands auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                </p>
                <p className="mt-4">
                  <strong>Double-Opt-in:</strong> Nach Ihrer Anmeldung erhalten Sie eine Bestätigungs-E-Mail. Erst nach Klick auf den enthaltenen Link werden Sie in den Verteiler aufgenommen. Im Rahmen dieses Verfahrens speichern wir den Zeitpunkt der Anmeldung, den Zeitpunkt der Bestätigung sowie Ihre IP-Adresse zum Nachweis der Einwilligung.
                </p>
                <p className="mt-4">
                  <strong>Abmeldung:</strong> Sie können den Newsletter jederzeit über den „Abmelden"-Link am Ende jeder Nachricht oder per E-Mail an datenschutz@optimazed.de wieder abbestellen. Mit der Abmeldung beenden wir den Versand. Die Nachweisdaten Ihrer ursprünglichen Einwilligung speichern wir weiterhin zur Erfüllung unserer Dokumentationspflichten.
                </p>
                <p className="mt-4">
                  <strong>Auftragsverarbeiter:</strong> Der Versand erfolgt über SendGrid (Twilio Inc., USA — EU-US Data Privacy Framework, AVV abgeschlossen).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">6. Einsatz von Künstlicher Intelligenz (KI)</h2>
                <p>
                  Zur effizienten Erstellung von Blog-Inhalten setzen wir generative KI-Werkzeuge ein, insbesondere Claude von Anthropic, Inc. (USA — EU-US Data Privacy Framework, Auftragsverarbeitungsvertrag abgeschlossen).
                </p>
                <p className="mt-4">
                  <strong>Transparenz nach EU AI Act (Art. 50 Abs. 4):</strong> KI-unterstützt erstellte Texte sind direkt am jeweiligen Artikel als solche gekennzeichnet. Die Inhalte werden ausschließlich als Entwurf von der KI vorbereitet und vor Veröffentlichung redaktionell geprüft.
                </p>
                <p className="mt-4">
                  <strong>Keine Verarbeitung personenbezogener Daten:</strong> Bei der Generierung von Blog-Inhalten werden keine personenbezogenen Daten unserer Leser oder Kunden an den KI-Anbieter übertragen. Eingaben an die KI bestehen aus öffentlich verfügbaren Quelltexten (z. B. RSS-Nachrichten) sowie redaktionellen Vorgaben.
                </p>
                <p className="mt-4">
                  <strong>Hinweis:</strong> KI-generierte Inhalte können Ungenauigkeiten enthalten. Sie ersetzen keine fachliche oder rechtliche Beratung im Einzelfall.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">7. Ihre Rechte</h2>
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
                  <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy mt-8 mb-4">8. Kontakt</h2>
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
