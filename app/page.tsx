'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import WaitlistForm from '@/components/WaitlistForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main>
      <Header />
      <CookieBanner />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          animate={{
            y: scrollY * 0.5,
          }}
          transition={{ type: 'spring', damping: 100, mass: 3 }}
        />

        <div className="relative z-10 container-max text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              KI-Automatisierung für Ihr
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> Geschäft</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Sparen Sie Zeit und Kosten durch intelligente Automatisierung. Dokumentenverarbeitung, Kundenservice und Sales – vollautomatisiert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#waitlist" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Kostenlose Demo
            </a>
            <a href="#services" className="btn-secondary border-white text-white hover:bg-white/10">
              Mehr erfahren
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Trust Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-gray-50 border-b border-gray-200"
      >
        <div className="container-max">
          <p className="text-center text-gray-600 mb-8 font-semibold">Vertraut von Unternehmen in ganz Deutschland</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-gray-600 text-sm font-semibold"
              >
                Partner {i + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Warum Cappai wählen?</h2>
            <p className="section-subheading text-gray-600 text-lg">
              Wir kombinieren neueste KI-Technologie mit deutschem Handwerk
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: '⚡', title: 'Schnelle Implementierung', desc: 'Innerhalb von Tagen, nicht Monaten. Bewährte Prozesse für schnelle Ergebnisse.' },
              { icon: '🔒', title: 'Deutsche Datensicherheit', desc: 'DSGVO-konform. Ihre Daten bleiben bei Ihnen oder in Deutschland gehostet.' },
              { icon: '🤝', title: 'Experten-Support', desc: 'Persönliche Unterstützung auf Deutsch. Wir kennen Ihre Branche.' },
              { icon: '💰', title: 'Kostenersparnis', desc: 'Reduzieren Sie manuelle Arbeit um bis zu 80%. ROI in Monaten.' },
              { icon: '📈', title: 'Skalierbar', desc: 'Von kleinen Projekten bis unternehmensweiter Automatisierung.' },
              { icon: '🔧', title: 'Modular', desc: 'Nutzen Sie nur, was Sie brauchen. Einfach zu erweitern.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover-lift"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Unsere Services</h2>
            <p className="section-subheading text-gray-600">Zwei Wege, um KI-Automatisierung zu nutzen</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                title: '✨ Managed Services',
                subtitle: 'Wir übernehmen alles',
                color: 'from-primary-600 to-primary-700',
                features: ['Vollständige Projektanalyse', 'Maßgeschneiderte Automatisierung', 'Integration mit bestehenden Systemen', 'Schulung Ihres Teams', '24/7 Monitoring und Support']
              },
              {
                title: '🚀 SaaS Platform',
                subtitle: 'Self-Service KI-Automatisierung',
                color: 'from-purple-600 to-purple-700',
                features: ['Vordefinierte Templates', 'No-Code Setup', 'API für Custom Integration', 'Detaillierte Analytics', 'Pay-as-you-go Preismodell']
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover-lift"
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-primary-600 font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#waitlist" className="btn-primary w-full">
                  Jetzt starten
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-32">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Häufige Anwendungsfälle</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: '📄 Rechnungsverarbeitung', desc: 'Automatische Datenextraktion, Kategorisierung, Verarbeitung' },
              { title: '💬 Kundenservice', desc: 'KI-Chatbots, automatisches Ticketing, Sentiment-Analyse' },
              { title: '🎯 Lead-Qualifizierung', desc: 'Automatische Bewertung und Priorisierung' },
              { title: '✍️ Inhaltsgenerierung', desc: 'Blog, E-Mails, Social Media Posts' },
              { title: '📁 Dokumentenverwaltung', desc: 'OCR, Klassifizierung, Archivierung' },
              { title: '👥 HR-Automatisierung', desc: 'CV-Screening, Onboarding Automation' },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 hover-lift cursor-pointer"
              >
                <h4 className="font-bold text-gray-900 mb-2">{useCase.title}</h4>
                <p className="text-sm text-gray-700">{useCase.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Transparente Preisgestaltung</h2>
            <p className="section-subheading text-gray-600">Wählen Sie den Plan, der zu Ihrem Unternehmen passt</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'Starter',
                price: 'Kostenlos',
                features: ['Bis zu 100 Dokumente/Monat', 'Basis-Templates', 'Email-Support'],
              },
              {
                name: 'Professional',
                price: '€299',
                period: '/Monat',
                highlighted: true,
                features: ['Unlimited Dokumente', 'Advanced Templates', 'Priority Support', 'Integrations'],
              },
              {
                name: 'Enterprise',
                price: 'Individuell',
                features: ['Custom Solutions', 'Dedicated Manager', '24/7 Support', 'SLA Guarantee'],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className={`rounded-xl p-8 transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="ml-2">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex gap-2">
                      <span>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#waitlist" className={plan.highlighted ? 'btn-secondary' : 'btn-primary'}>
                  Jetzt starten
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 sm:py-32 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-max max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Bereit zu starten?</h2>
            <p className="text-primary-100 text-lg">
              Treten Sie unserer Warteliste bei und erhalten Sie Early-Bird-Rabatten.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-xl"
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32">
        <div className="container-max max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Häufig gestellte Fragen
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { q: 'Wie lange dauert die Implementierung?', a: 'Bei unseren Managed Services typischerweise 2-4 Wochen. Mit unserer SaaS-Plattform können Sie sofort starten.' },
              { q: 'Ist meine Daten sicher?', a: 'Ja, wir sind DSGVO-konform und setzen Bank-Level Verschlüsselung ein. Daten werden in Deutschland gehostet.' },
              { q: 'Welche Systeme integrieren Sie?', a: 'Wir integrieren mit SAP, NetSuite, Salesforce und über 500 weiteren Tools via APIs.' },
              { q: 'Was ist, wenn etwas nicht funktioniert?', a: 'Unser Support-Team auf Deutsch antwortet innerhalb von 24 Stunden. Bei Managed Services haben Sie einen dedizierten Manager.' },
              { q: 'Kann ich jederzeit kündigen?', a: 'Bei unserer SaaS-Plattform jederzeit mit 30 Tagen Kündigungsfrist. Bei Managed Services ist eine individuelle Vereinbarung möglich.' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover-lift">
                <h4 className="font-semibold text-gray-900 mb-3">{item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
