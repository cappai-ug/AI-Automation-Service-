'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'
import LatestPostsSection from '@/components/LatestPostsSection'
import LeadMagnetSection from '@/components/LeadMagnetSection'

const faqs = [
  {
    q: 'Wie lange dauert die Einrichtung?',
    a: 'In der Regel 2–4 Wochen für eine komplette Implementierung. Wir starten klein — eine Aufgabe, ein Pilot — und skalieren erst, wenn der Prozess sauber läuft.'
  },
  {
    q: 'Welche Integrations-Möglichkeiten gibt es?',
    a: 'Wir unterstützen Google Calendar, Outlook, Gmail, Office 365, HubSpot, Pipedrive, DATEV und 100+ weitere Tools. Branchen-Software und Custom-Integrationen besprechen wir im Erstgespräch.'
  },
  {
    q: 'Ist das DSGVO-konform?',
    a: 'Ja! Vollständig DSGVO-konform. Daten werden auf Servern in der EU gespeichert, verschlüsselt übertragen und nicht für Training genutzt.'
  },
  {
    q: 'Was, wenn ein Patient noch einen Menschen sprechen möchte?',
    a: 'Der KI-Rezeptionist kann jederzeit zu Ihnen durchstellen – entweder automatisch nach 2-3 Fragen oder auf Wunsch des Anrufers. Sie entscheiden die Regel.'
  },
  {
    q: 'Funktioniert das auch mit meinem CRM?',
    a: 'Ja! Wir integrieren mit HubSpot, Pipedrive, Salesforce, Zoho und hunderten anderen Tools. Neue Leads und Termine werden automatisch synchronisiert.'
  },
  {
    q: 'Für welche Branchen ist das geeignet?',
    a: 'Besonders für Arztpraxen, Anwalts- und Steuerkanzleien, Handwerksbetriebe und Agenturen — überall, wo viel Routine über Telefon, E-Mail und Dokumente läuft.'
  },
  {
    q: 'Wie viel Zeit spare ich wirklich?',
    a: 'Im Schnitt 8–12 Stunden Arbeit pro Woche, je nachdem welche Aufgaben Sie automatisieren. Im kostenlosen Strategiegespräch schätzen wir Ihr konkretes Potenzial realistisch ein.'
  },
  {
    q: 'Und wenn mein Unternehmen sehr speziell ist?',
    a: 'Wir passen alles an Ihre Bedürfnisse an. Spezielle Branchenprozesse, Ihre Arbeitsweise, Ihre Systeme. Wir helfen Ihnen, genau die Aufgaben zu automatisieren, die bei Ihnen am meisten Zeit kosten.'
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const steps = 60
    const stepValue = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="bg-white overflow-hidden">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-blue-950 to-navy pt-20">
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.2) 0%, transparent 50%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        />

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-5 bg-secondary"
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}

        <div className="relative z-10 container-max text-center text-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight text-white">
              <motion.div
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                KI-Automatisierung
              </motion.div>
              <motion.div
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="text-secondary">für Ihr Geschäft.</span>
              </motion.div>
              <motion.div
                className="block text-4xl sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Einfach. Effektiv. Intelligent.
              </motion.div>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Automatisieren Sie Ihre Geschäftsprozesse mit KI. Von <span className="text-secondary font-semibold">Anrufbearbeitung bis Rechnungsverwaltung</span> – OPTIMAZED übernimmt die repetitiven Aufgaben, damit Sie sich auf das konzentrieren, was zählt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <a href="#waitlist" className="bg-accent hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg min-h-12 min-w-12 inline-block">
              🎯 Kostenlose Demo
            </a>
            <a href="#pain-points" className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-lg min-h-12 min-w-12 inline-block">
              Wie es funktioniert →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: <Counter end={85} suffix="%" />, label: 'Weniger verpasste Anrufe' },
              { number: <Counter end={10} suffix=" Std" />, label: 'Zeit/Woche eingespart' },
              { number: <>24/7</>, label: 'Erreichbarkeit' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-secondary">{stat.number}</div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* ===== PAIN POINTS SECTION ===== */}
      <section id="pain-points" className="py-32 bg-soft-white relative">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-heading text-navy">Ihre häufigsten Herausforderungen</h2>
            <p className="section-subheading mt-4 text-center">
              Erkunden Sie, wie OPTIMAZED diese Probleme für Sie löst
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: '☎️',
                problem: 'Verpasste Anrufe',
                desc: 'Nach Stunden fragt der Patient: „Warum antwortet keiner?" Die Terminvergabe läuft ins Leere.',
                solution: 'OPTIMAZED beantwortet jeden Anruf. Bucht Termine. Sendet Bestätigung. Der Patient ist zufrieden.',
              },
              {
                icon: '📧',
                problem: 'E-Mail-Chaos',
                desc: 'Wichtige Anfragen gehen in der Mail-Flut unter. Kundenanfragen warten Stunden oder Tage.',
                solution: 'KI liest, kategorisiert und antwortet. Sie sehen nur das, was wichtig ist. Sofort.',
              },
              {
                icon: '📞',
                problem: 'Manuelle Planung',
                desc: 'Sie verbringen Stunden mit Terminabstimmung. Doppelbuchungen führen zu Konflikten.',
                solution: 'Intelligente Kalenderintegration. Keine doppelten Termine. Automatische Erinnerungen.',
              },
              {
                icon: '💰',
                problem: 'Verlorene Leads',
                desc: 'Der beste Lead geht an den Konkurrenten – weil Sie nicht schnell genug antworteten.',
                solution: 'OPTIMAZED antwortet in Minuten. Mit personalisierter Info. Der Lead wird Kunde.',
              },
              {
                icon: '💸',
                problem: 'Personal ist knapp',
                desc: 'Eine zusätzliche Empfangskraft ist teuer und schwer zu finden. Aber ohne Empfang geht nichts.',
                solution: 'Die KI übernimmt die Routine — keine Krankheitstage, keine Urlaubsplanung, immer verfügbar.',
              },
              {
                icon: '⏰',
                problem: 'Zeitverschwendung',
                desc: 'Sie verbringen 15 Stunden/Woche mit Administration statt mit Ihren Kunden.',
                solution: 'Automatische Rechnungen, Buchungen, Erinnerungen. Sie gewinnen 10 Stunden/Woche.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-accent hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-2">{item.problem}</h3>
                <p className="text-gray-600 mb-4 text-sm italic">"{item.desc}"</p>
                <div className="pt-4 border-t-2 border-accent/30">
                  <p className="text-sm font-semibold text-accent">✅ {item.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SHOWCASE ===== */}
      <section id="features" className="py-32 relative">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-heading text-navy">Was OPTIMAZED für Sie tut</h2>
            <p className="section-subheading mt-4">
              Fünf Funktionen. Ein System. Einfach nur besser.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎙️',
                title: 'KI-Rezeptionist',
                desc: 'Beantwortet Anrufe 24/7. Spricht perfekt Deutsch. Bucht Termine. Übergibt an Sie, wenn nötig.',
                features: ['Spracherkennung', 'Automatische Buchung', 'Anruf-Zusammenfassung', 'Backup-Nummern']
              },
              {
                icon: '📧',
                title: 'E-Mail-Management',
                desc: 'Liest Ihre E-Mails. Kategorisiert. Schlägt Antworten vor. Sie genehmigen oder senden.',
                features: ['Auto-Kategorisierung', 'Intelligente Entwürfe', 'Smart-Ordner', 'Spam-Filter']
              },
              {
                icon: '🎯',
                title: 'Lead-Qualifizierung',
                desc: 'Neue Anfrage = automatische Analyse. Sofort antworten. Lead-Scoring. Gewonnene Kunden.',
                features: ['Automatische Analyse', 'Lead-Scoring', 'Auto-Response', 'CRM-Sync']
              },
              {
                icon: '📅',
                title: 'Terminplanung',
                desc: 'Intelligenter Kalender. Keine Doppelbuchungen. Automatische Erinnerungen. Bestätigungen.',
                features: ['Kalender-Sync', 'Pufferzeit', 'Auto-Reminders', 'Bestätigungslinks']
              },
              {
                icon: '💼',
                title: 'Rechnungsverwaltung',
                desc: 'Rechnungen automatisch versendet. Zahlungen nachverfolgt. Mahnung ohne Aufwand.',
                features: ['Auto-Versand', 'Zahlungs-Tracking', 'Automatische Mahnung', 'Archivierung']
              },
              {
                icon: '📊',
                title: 'Analytics & Berichte',
                desc: 'Sehen Sie genau: Wie viele Anrufe. Welche Leads. Wie viel Zeit eingespart. ROI-Berechnung.',
                features: ['Anrufstatistiken', 'Lead-Conversion', 'Zeitersparnis', 'Kostenersparnis']
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
                  <p className="text-gray-700 mb-4">{feature.desc}</p>
                  <div className="space-y-2">
                    {feature.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-secondary font-bold">•</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="py-32 bg-gradient-to-b from-soft-white to-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-heading text-navy">So könnte es in Ihrer Praxis funktionieren</h2>
            <p className="section-subheading mt-4 text-center">
              Beispiele basierend auf erwarteten Verbesserungen – zeigt das Potenzial für Ihre Branche
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🦷',
                name: 'Zahnarztpraxis (5 Mitarbeiter)',
                team: 'Typisches Szenario',
                problem: '40 Anrufe/Tag, 2-3 verpasste Termine/Tag, Empfang dauerhaft am Limit',
                result: 'Mit OPTIMAZED: Kein einziger verpasster Anruf. +5-7 automatisch gebuchte Termine/Woche.',
                metrics: [
                  'Deutlich mehr gebuchte Termine pro Woche',
                  '8-12 Stunden Empfangszeit/Woche frei',
                  'Empfang konzentriert sich auf Patientenerlebnis'
                ]
              },
              {
                icon: '⚖️',
                name: 'Kanzlei (3 Anwälte)',
                team: 'Typisches Szenario',
                problem: '80-120 Mails/Tag. Wichtige Anfragen können übersehen werden. Lead-Response dauert 6-12h',
                result: 'Mit OPTIMAZED: Neue Anfragen werden in 15-30 Minuten beantwortet. Automatische Kategorisierung.',
                metrics: [
                  'Lead-Response: 6-12h → 15-30 Min erwartet',
                  'Keine übersehenen Anfragen mehr',
                  'Team spart 8-12 Stunden/Woche'
                ]
              },
              {
                icon: '🚀',
                name: 'Marketing-Agentur (8 Mitarbeiter)',
                team: 'Typisches Szenario',
                problem: 'Viele Anfragen, unstrukturierte Verfolgung. Einige Leads fallen durchs Raster. Rechnungsversand manuell.',
                result: 'Mit OPTIMAZED: Strukturierte Lead-Verwaltung. Automatisierte Rechnungen und Erinnerungen.',
                metrics: [
                  'Höhere Lead-Conversion durch schnellere Reaktion',
                  'Kein Lead fällt mehr durchs Raster',
                  'Rechnungs-Mahnung: 100% automatisiert'
                ]
              },
            ].map((study, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl glass border border-gray-200 hover-lift overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="text-5xl mb-3">{study.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-1">{study.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{study.team}</p>

                  <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">HERAUSFORDERUNG</p>
                      <p className="text-sm text-gray-700">{study.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">ERGEBNIS</p>
                      <p className="text-sm text-accent font-semibold">{study.result}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {study.metrics.map((metric, j) => (
                      <div key={j} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-accent font-bold flex-shrink-0">✓</span>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-32 bg-gradient-to-br from-navy via-blue-950 to-navy text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-white">
              So arbeiten wir <span className="text-secondary">mit Ihnen</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Wir richten alles ein, optimieren laufend und begleiten Sie — vom ersten
              Pilot bis zum eingespielten Betrieb. Kein Großprojekt, sondern Schritt für Schritt.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-10 sm:p-12 rounded-2xl glass border border-white/20"
            >
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  'Komplette Analyse Ihrer Prozesse',
                  'Maßgeschneiderte KI-Konfiguration',
                  'Anbindung an Ihre vorhandene Software',
                  'Pilotbetrieb statt Big-Bang-Umstellung',
                  'Persönliche Einarbeitung Ihres Teams',
                  'Laufende Betreuung und Optimierung',
                ].map((benefit, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-secondary text-xl flex-shrink-0">→</span>
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Im kostenlosen Strategiegespräch schauen wir uns Ihre größten Engpässe an
                  und sagen Ihnen ehrlich, was sich bei Ihnen lohnt.
                </p>
                <a
                  href="#waitlist"
                  className="bg-accent hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
                >
                  Kostenloses Strategiegespräch
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section id="waitlist" className="py-32 bg-gradient-to-r from-accent via-blue-600 to-blue-700 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l30 30-30 30L0 30z" fill="%23ffffff" fill-opacity=".05"/%3E%3C/svg%3E")',
          }}
        />

        <div className="container-max max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Starten Sie Ihre <span className="text-secondary">kostenlose Demo</span>
            </h2>
            <p className="text-xl text-white/90">
              Sehen Sie, wie OPTIMAZED Ihre Praxis, Kanzlei oder Agentur verändert.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* ===== Latest Blog Posts ===== */}
      <LatestPostsSection />

      {/* ===== Lead Magnet ===== */}
      <LeadMagnetSection />

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="container-max max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading text-navy">Häufig gestellte Fragen</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-r from-soft-white to-gray-100 p-6 rounded-xl border border-gray-200 hover-lift"
              >
                <h4 className="font-bold text-navy text-lg mb-2">{item.q}</h4>
                <p className="text-gray-700">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
