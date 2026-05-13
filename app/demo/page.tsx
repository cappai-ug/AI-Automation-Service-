'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function DemoPageContent() {
  const searchParams = useSearchParams()
  const company = searchParams.get('company') || 'Ihr Unternehmen'
  const industry = searchParams.get('industry') || 'Business'
  const painPoint = searchParams.get('painPoint') || 'Effizienz'
  const email = searchParams.get('email') || ''

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedFeature, setSelectedFeature] = useState(0)

  const industryContent: Record<string, any> = {
    doctor: {
      title: 'Für Zahnarztpraxen',
      problem: 'Verpasste Anrufe & manuelle Terminverwaltung',
      solution: 'AI beantwortet Anrufe, bucht Termine, sendet Bestätigungen',
      stats: [
        { value: '95%', label: 'Weniger verpasste Anrufe' },
        { value: '12h', label: 'Zeitersparnis/Woche' },
        { value: '€2k', label: 'Kostenersparnis/Monat' },
      ],
    },
    lawyer: {
      title: 'Für Kanzleien',
      problem: 'E-Mail-Chaos & langsame Lead-Response',
      solution: 'KI kategorisiert Mails, qualifiziert Leads, antwortet sofort',
      stats: [
        { value: '80%', label: 'Schnellere Response-Zeit' },
        { value: '15h', label: 'Zeitersparnis/Woche' },
        { value: '€3k', label: 'Mehrertrag/Monat' },
      ],
    },
    agency: {
      title: 'Für Agenturen',
      problem: 'Zu viele Anfragen, schlechte Lead-Verwaltung',
      solution: 'Automatische Qualifizierung, Lead-Scoring, Automation',
      stats: [
        { value: '40%', label: 'Mehr qualifizierte Leads' },
        { value: '20h', label: 'Zeitersparnis/Woche' },
        { value: '€4k', label: 'Mehrertrag/Monat' },
      ],
    },
    default: {
      title: 'Für Ihr Unternehmen',
      problem: 'Repetitive Aufgaben kosten Zeit & Geld',
      solution: 'OPTIMAZED automatisiert, qualifiziert, optimiert',
      stats: [
        { value: '85%', label: 'Weniger manuelle Arbeit' },
        { value: '10h', label: 'Zeitersparnis/Woche' },
        { value: '€1.5k', label: 'Kostenersparnis/Monat' },
      ],
    },
  }

  const content = industryContent[industry] || industryContent.default

  const features = [
    {
      icon: '🎙️',
      title: 'AI-Rezeptionist',
      desc: 'Antwortet auf Anrufe, bucht Termine, qualifiziert Leads',
      video: 'https://via.placeholder.com/400x300?text=AI+Receptionist',
    },
    {
      icon: '📧',
      title: 'Email-Automatisierung',
      desc: 'Kategorisiert Mails, schlägt Antworten vor, filtert automatisch',
      video: 'https://via.placeholder.com/400x300?text=Email+Management',
    },
    {
      icon: '🎯',
      title: 'Lead-Qualifizierung',
      desc: 'Klassifiziert Leads nach Potenzial, antwortet sofort',
      video: 'https://via.placeholder.com/400x300?text=Lead+Scoring',
    },
  ]

  const timeline = [
    {
      step: 1,
      title: 'Optimization Call (30 Min)',
      items: [
        'Wir verstehen Ihre Workflows & Schmerzpunkte',
        'Zeigen Ihnen den benutzerdefinierten Plan',
        'Besprechen Timeline & Erwartungen',
        'Beantworten alle Fragen',
      ],
    },
    {
      step: 2,
      title: '2-Wochen Free Trial',
      items: [
        'Vollständiger Zugriff auf OPTIMAZED',
        'Wir richten es für Ihre Workflows ein',
        'Tägliche Check-ins & Support',
        'Keine Kreditkarte erforderlich',
      ],
    },
    {
      step: 3,
      title: 'Scale & Optimize',
      items: [
        'Ihr Team spart Zeit ein',
        'Wir optimieren basierend auf Ihren Daten',
        'Kontinuierliche Verbesserungen',
        'ROI innerhalb von 2-4 Wochen',
      ],
    },
  ]

  const faqs = [
    {
      q: 'Wie lange dauert das Gespräch?',
      a: 'Das Optimization Call dauert etwa 30 Minuten. Wir fragen nach Ihren Workflows, zeigen wie OPTIMAZED Ihnen hilft, und klären offene Fragen.',
    },
    {
      q: 'Kostet das etwas?',
      a: 'Nein, komplett kostenlos. Der Call ist unverbindlich und es geht nur darum, zu sehen, ob OPTIMAZED für Sie passt.',
    },
    {
      q: 'Was passiert nach dem Call?',
      a: 'Sie erhalten Zugang zu 14 Tagen kostenlosem Trial. Wir richten alles für Ihre spezifischen Workflows ein und unterstützen Sie täglich.',
    },
    {
      q: 'Kann ich es vorher testen?',
      a: 'Ja! Nach dem Call bekommen Sie sofort 14 Tage kostenlosen Zugriff. Kein Abo, keine versteckten Gebühren.',
    },
    {
      q: 'Was wenn OPTIMAZED nicht passt?',
      a: 'Wir sagen Ihnen ehrlich Bescheid. Falls es nicht passt, können Sie ohne Kosten gehen. Aber bei 95% der Unternehmen funktioniert es perfekt.',
    },
    {
      q: 'Wie schnell sehe ich Ergebnisse?',
      a: 'Die meisten sehen bereits in der ersten Woche Verbesserungen. Nach 2-4 Wochen ist der ROI deutlich sichtbar.',
    },
  ]

  return (
    <main className="bg-white overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-accent to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l30 30-30 30L0 30z" fill="%23ffffff"/%3E%3C/svg%3E")',
        }} />

        <div className="container-max max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Großartig! Lassen Sie uns {company} optimieren.
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Sehen Sie, wie OPTIMAZED {painPoint && `Ihre "${painPoint}"-Probleme`} für Ihr Unternehmen löst.
            </p>
            <a
              href="#booking"
              className="inline-block bg-white text-accent font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Optimization Call buchen
            </a>
          </motion.div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-soft-white">
        <div className="container-max max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-gray-600">
              Problem: <span className="font-semibold">{content.problem}</span>
            </p>
            <p className="text-lg text-accent font-semibold mt-2">
              Lösung: {content.solution}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-2xl overflow-hidden mb-12 aspect-video flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="text-6xl mb-4">▶️</div>
              <p className="text-xl">Klicken Sie hier für Demo-Video</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {content.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl text-center border-2 border-accent/20"
              >
                <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-20">
        <div className="container-max max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Das sehen Sie in Aktion
            </h2>
            <p className="text-lg text-gray-600">
              Interaktive Demos der wichtigsten Features
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Feature Selection */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedFeature(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-full p-6 rounded-xl text-left transition-all ${
                    selectedFeature === i
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:border-accent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                      <p className={selectedFeature === i ? 'text-white/90' : 'text-gray-600'}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Right - Video */}
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center"
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-lg">{features[selectedFeature].title} Demo</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline - What Happens Next */}
      <section className="py-20 bg-soft-white">
        <div className="container-max max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Was passiert als Nächstes?
            </h2>
            <p className="text-lg text-gray-600">
              Ein einfacher 3-Schritte-Prozess zum Erfolg
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl border-2 border-accent">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.items.map((itemText, j) => (
                      <li key={j} className="flex gap-3 text-gray-700">
                        <span className="text-accent font-bold flex-shrink-0">✓</span>
                        <span>{itemText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-accent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gradient-to-br from-navy to-blue-950 text-white">
        <div className="container-max max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit, Ihr Unternehmen zu optimieren?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Buchen Sie ein unverbindliches Gespräch. Wir zeigen Ihnen genau, wie OPTIMAZED {company} transformiert.
            </p>

            <div className="bg-white/10 p-8 rounded-xl mb-8 backdrop-blur">
              <p className="text-sm text-gray-300 mb-4">📅 Dauert nur 30 Minuten</p>
              <p className="text-sm text-gray-300 mb-4">💰 100% kostenlos & unverbindlich</p>
              <p className="text-sm text-gray-300">🎁 Erhalten Sie danach 14 Tage kostenlosen Zugriff</p>
            </div>

            <a
              href={`https://cal.com/optimized/demo?email=${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-navy font-bold py-4 px-12 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 text-lg"
            >
              Jetzt Optimization Call buchen
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-max max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Häufig gestellte Fragen
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-2 border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-navy">{faq.q}</span>
                  <span className="text-2xl text-accent">{expandedFaq === i ? '−' : '+'}</span>
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 border-t-2 border-gray-200 text-gray-700">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-soft-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-max"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6">
            Sie haben noch Fragen?
          </h2>
          <a
            href={`https://cal.com/optimized/demo?email=${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-all"
          >
            Jetzt buchen – 100% kostenlos
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <DemoPageContent />
    </Suspense>
  )
}
