'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import WaitlistForm from '@/components/WaitlistForm'

// Animated text reveal component
const TextReveal = ({ children, className = '' }: { children: string; className?: string }) => {
  const words = children.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Counter component
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
      <CookieBanner />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 pt-20">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-5 bg-primary-400"
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
          {/* Main heading with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight text-white">
              <TextReveal className="block">
                KI-Automatisierung
              </TextReveal>
              <TextReveal className="block">
                <span className="text-cyan-300">für Ihr Geschäft</span>
              </TextReveal>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Automatisieren Sie Ihre Geschäftsprozesse mit intelligenter KI. <span className="text-primary-300 font-semibold">80% weniger manuelle Arbeit</span>, messbare Ergebnisse in Wochen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <a href="#waitlist" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg">
              ✨ Kostenlose Demo
            </a>
            <a href="#services" className="btn-secondary border-white text-white hover:bg-white/10 text-lg">
              Mehr erfahren →
            </a>
          </motion.div>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: <Counter end={500} />, label: 'Unternehmen' },
              { number: <Counter end={80} suffix="%" />, label: 'Zeitersparnis' },
              { number: <Counter end={2} suffix="-4 Wochen" />, label: 'Implementierung' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-300">{stat.number}</div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
            <h2 className="section-heading text-gradient">Intelligente Automatisierung</h2>
            <p className="section-subheading mt-4">
              Erleben Sie die Kraft von KI-getriebener Automation in Ihrem Geschäft
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Blitzschnelle Verarbeitung',
                desc: 'Automatisieren Sie komplexe Prozesse in Sekunden, nicht Stunden',
                gradient: 'from-yellow-400 to-orange-500',
              },
              {
                icon: '🔒',
                title: 'Enterprise-Sicherheit',
                desc: 'DSGVO-konform mit Verschlüsselung auf Bankenniveau',
                gradient: 'from-blue-400 to-cyan-500',
              },
              {
                icon: '🧠',
                title: 'KI-Powered',
                desc: 'Neueste GPT-Modelle und Custom-Trainierte Lösungen',
                gradient: 'from-purple-400 to-pink-500',
              },
              {
                icon: '📊',
                title: 'Detaillierte Analytics',
                desc: 'Echtzeitberichte und Optimierungsempfehlungen',
                gradient: 'from-green-400 to-emerald-500',
              },
              {
                icon: '🔄',
                title: 'Nahtlose Integration',
                desc: 'Verbinden Sie mit 500+ bestehenden Tools und APIs',
                gradient: 'from-indigo-400 to-blue-500',
              },
              {
                icon: '🤝',
                title: 'Dedicated Support',
                desc: 'Deutschsprachiger Support 24/7 für Ihre Fragen',
                gradient: 'from-red-400 to-pink-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -15 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden hover-lift"
              >
                {/* Animated gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-heading">Erfolgsgeschichten</h2>
            <p className="section-subheading mt-4">
              Echte Ergebnisse von Unternehmen wie Ihren
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                company: 'E-Commerce Startup',
                improvement: '85% Zeitersparnis',
                process: 'Rechnungsverarbeitung',
                before: '8 Stunden/Tag',
                after: '1 Stunde/Tag',
                metric: '+€50.000 zusätzliche Einnahmen/Jahr',
              },
              {
                company: 'Consulting Firma',
                improvement: '92% weniger Fehler',
                process: 'Dokumentenclassifizierung',
                before: '2% Fehlerquote',
                after: '0.1% Fehlerquote',
                metric: '€120.000 weniger Nachbearbeitung/Jahr',
              },
              {
                company: 'Service Provider',
                improvement: '70% schneller',
                process: 'Kundenservice',
                before: '45 Min. Response',
                after: '15 Min. Response',
                metric: '+35% Kundenzufriedenheit',
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{study.company}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl font-bold text-primary-600">{study.improvement}</span>
                    <span className="text-sm text-gray-600">in {study.process}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Vorher:</span>
                      <span className="font-semibold text-gray-900">{study.before}</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                        initial={{ width: '20%' }}
                        whileInView={{ width: '95%' }}
                        transition={{ delay: 0.3, duration: 1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Nachher:</span>
                      <span className="font-semibold text-primary-600">{study.after}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-primary-600">{study.metric}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-32">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-heading">Transparent Preismodelle</h2>
            <p className="section-subheading mt-4">Flexible Lösungen für jedes Budget</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '€0',
                period: 'für immer',
                highlight: false,
                features: ['Bis 100 Dokumente/Monat', 'Basis-Templates', 'Email Support', 'Community Access'],
              },
              {
                name: 'Professional',
                price: '€299',
                period: '/Monat',
                highlight: true,
                features: ['Unbegrenzte Dokumente', 'Advanced Templates', 'Priority Support', 'API Access', 'Custom Integrations'],
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                highlight: false,
                features: ['Alles enthalten', 'Dedicated Account Manager', '24/7 Support', 'Custom SLA', 'On-Premise Option'],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl transform scale-105 hover-lift'
                    : 'bg-white border-2 border-gray-200 hover-lift'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      BELIEBT
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="ml-2 opacity-75">{plan.period}</span>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="text-xl">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#waitlist"
                  className={`w-full block text-center py-3 px-6 rounded-full font-bold transition-all ${
                    plan.highlight
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Jetzt starten
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-white">
              Unsere <span className="text-cyan-300">Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Zwei flexible Modelle für Ihre Automatisierungsbedürfnisse
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                icon: '✨',
                title: 'Managed Services',
                desc: 'Wir übernehmen alles – vom Konzept bis zum laufenden Betrieb',
                benefits: ['Projektanalyse & Strategie', 'Maßgeschneiderte Implementierung', 'Integration & Testing', 'Team Training', '24/7 Monitoring & Support'],
              },
              {
                icon: '🚀',
                title: 'SaaS Platform',
                desc: 'Self-Service Tools für maximale Flexibilität und Kontrolle',
                benefits: ['Pre-built Templates', 'No-Code Interface', 'Real-time Analytics', 'API & Webhooks', 'Community Support'],
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative p-12 rounded-2xl glass border border-white/20 hover-lift"
              >
                <div className="text-6xl mb-6">{service.icon}</div>
                <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-300 mb-8 text-lg">{service.desc}</p>

                <ul className="space-y-3 mb-8">
                  {service.benefits.map((benefit, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-primary-400 text-xl">→</span>
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <a href="#waitlist" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 w-full text-center">
                  Mehr Informationen
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section id="waitlist" className="py-32 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Animated background */}
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

        <div className="container-max max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Bereit für <span className="text-yellow-300">AI-Automatisierung?</span>
            </h2>
            <p className="text-xl text-primary-100">
              Starten Sie mit einer kostenlosen Beratung und sehen Sie, wie viel Sie sparen können
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

      {/* ===== FAQ ===== */}
      <section className="py-32">
        <div className="container-max max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Häufig gestellte Fragen</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Wie lange dauert die Implementierung?', a: 'Managed Services: 2-4 Wochen. SaaS: Sofort startbereit.' },
              { q: 'Ist mein Unternehmen zu groß/klein?', a: 'Nein! Wir unterstützen Startups bis Enterprise-Unternehmen.' },
              { q: 'Was ist mit meiner Datensicherheit?', a: 'Wir sind DSGVO-zertifiziert mit Verschlüsselung auf Bankenniveau.' },
              { q: 'Kann ich später wechseln oder upgraden?', a: 'Ja, jederzeit! Flexible Verträge mit 30 Tagen Kündigungsfrist.' },
              { q: 'Gibt es Support auf Deutsch?', a: 'Ja, unser Team spricht fließend Deutsch und ist 24/7 erreichbar.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover-lift"
              >
                <h4 className="font-bold text-gray-900 text-lg mb-2">{item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
