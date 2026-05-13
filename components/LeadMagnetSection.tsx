'use client'

import { motion } from 'framer-motion'
import NewsletterSignup from './NewsletterSignup'

const BENEFITS = [
  'Welche Aufgaben sich heute schon zu 100 % automatisieren lassen',
  '7 konkrete Anwendungsfälle aus echten Praxen und Kanzleien',
  'Geschätzte Zeitersparnis pro Aufgabe (Stunden/Woche)',
  'Was DSGVO-konform geht — und wo Vorsicht geboten ist',
  'Checkliste zum Abhaken für Ihr Team',
]

export default function LeadMagnetSection() {
  return (
    <section
      id="lead-magnet"
      className="py-32 bg-gradient-to-br from-navy via-blue-950 to-navy text-white relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.25) 0%, transparent 50%)',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="container-max max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-block text-xs uppercase tracking-widest text-secondary font-semibold mb-3">
              Kostenlose Checkliste
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">
              7 Aufgaben, die KI in Ihrer Praxis sofort übernehmen kann
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Eine konkrete Checkliste für Praxen, Kanzleien und KMU. Direkt einsetzbar — von der Telefon-Annahme bis zur Rechnungsbearbeitung.
            </p>
            <ul className="space-y-2.5 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-secondary mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-200">{b}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-400">
              PDF-Format · 100 % kostenlos · DSGVO-konform · Sofort-Download nach Bestätigung
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-navy mb-2">
                Checkliste jetzt anfordern
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                Geben Sie Ihre E-Mail ein. Sie erhalten den Download-Link, nachdem Sie Ihre Anmeldung in einer Mail bestätigt haben.
              </p>
              <NewsletterSignup
                source="lead_magnet_praxis_checklist"
                wrapper="bare"
                theme="light"
                heading=""
                description=""
                consentText="Ich möchte die Checkliste per E-Mail erhalten und abonniere damit den OPTIMAZED-Newsletter (ca. 1 Mail/Woche). Abmeldung jederzeit über den Link in jeder Mail."
                ctaLabel="Checkliste per E-Mail anfordern"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
