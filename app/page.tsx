'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import WaitlistForm from '@/components/WaitlistForm'

export default function Home() {
  return (
    <main>
      <Header />
      <CookieBanner />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              KI-Automatisierung für Ihr Geschäft
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sparen Sie Zeit und Kosten durch intelligente Automatisierung. Von Dokumentenverarbeitung bis zur Kundenservice-KI – wir kümmern uns um die Technologie, Sie um Ihr Geschäft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
                Jetzt beitreten
              </button>
              <a href="#services" className="btn-secondary text-center">
                Mehr erfahren
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container-max">
          <p className="text-center text-gray-600 mb-8">Vertraut von Unternehmen in ganz Deutschland</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                Logo {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="section-heading">Warum Cappai wählen?</h2>
            <p className="section-subheading">
              Wir kombinieren neueste KI-Technologie mit deutschem Handwerk für optimale Ergebnisse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Schnelle Implementierung',
                description: 'Innerhalb von Tagen, nicht Monaten. Unsere bewährten Prozesse sorgen für schnelle Ergebnisse.',
                icon: '⚡'
              },
              {
                title: 'Deutsche Datensicherheit',
                description: 'DSGVO-konform. Ihre Daten bleiben bei Ihnen oder werden in Deutschland gehostet.',
                icon: '🔒'
              },
              {
                title: 'Experten-Support',
                description: 'Persönliche Unterstützung auf Deutsch. Wir kennen Ihre Branche und verstehen Ihre Herausforderungen.',
                icon: '🤝'
              },
              {
                title: 'Kostenersparnis',
                description: 'Reduzieren Sie manuelle Arbeit um bis zu 80%. ROI in Monaten, nicht Jahren.',
                icon: '💰'
              },
              {
                title: 'Skalierbar',
                description: 'Von kleinen Projekten bis zur unternehmensweiten Automatisierung – wir wachsen mit Ihnen.',
                icon: '📈'
              },
              {
                title: 'Modular',
                description: 'Nutzen Sie nur die Services, die Sie brauchen. Einfach zu erweitern, wenn Ihre Anforderungen wachsen.',
                icon: '🔧'
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-32 bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="section-heading">Unsere Services</h2>
            <p className="section-subheading">
              Zwei Wege, um KI-Automatisierung zu nutzen
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Done-for-You */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-primary-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Managed Services</h3>
              <p className="text-gray-600 mb-6">
                Wir übernehmen alles. Von Analyse über Implementierung bis zum laufenden Support.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Vollständige Projektanalyse</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Maßgeschneiderte Automatisierung</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Integration mit bestehenden Systemen</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Schulung Ihres Teams</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">24/7 Monitoring und Support</span>
                </li>
              </ul>
              <div className="text-sm text-gray-600 mb-6">
                <p className="font-semibold text-gray-900 mb-2">Ideal für:</p>
                <p>Unternehmen, die schnelle Ergebnisse wollen und keine Zeit für Implementierung haben.</p>
              </div>
              <button className="btn-primary w-full">Kostenlose Konsultation</button>
            </div>

            {/* SaaS Platform */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-primary-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 SaaS Platform</h3>
              <p className="text-gray-600 mb-6">
                Self-Service KI-Automatisierung. Vollständige Kontrolle, flexible Nutzung.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Vordefinierte Automatisierungsvorlagen</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">No-Code Setup</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">API für Custom Integration</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Detaillierte Reporting & Analytics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Pay-as-you-go Preismodell</span>
                </li>
              </ul>
              <div className="text-sm text-gray-600 mb-6">
                <p className="font-semibold text-gray-900 mb-2">Ideal für:</p>
                <p>Tech-savvy Teams, die Flexibilität und Skalierbarkeit brauchen.</p>
              </div>
              <button className="btn-secondary w-full">Platform erkunden</button>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Häufige Anwendungsfälle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Rechnungsverarbeitung', description: 'Automatische Datenextraktion, Kategorisierung, Verarbeitung' },
                { title: 'Kundenservice', description: 'KI-Chatbots, automatisches Ticketing, Sentiment-Analyse' },
                { title: 'Lead-Qualifizierung', description: 'Automatische Bewertung und Priorisierung von Leads' },
                { title: 'Inhaltsgenerierung', description: 'Produktbeschreibungen, E-Mail-Kampagnen, Social-Media-Posts' },
                { title: 'Dokumentenverwaltung', description: 'OCR, Klassifizierung, Archivierung' },
                { title: 'HR-Automatisierung', description: 'CV-Screening, Stellenausschreibung, Onboarding' },
              ].map((useCase, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{useCase.title}</h4>
                  <p className="text-sm text-gray-600">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="section-heading">Transparente Preisgestaltung</h2>
            <p className="section-subheading">
              Wählen Sie den Plan, der zu Ihrem Unternehmen passt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Kostenlos',
                description: 'Testen Sie die Plattform',
                features: ['Bis zu 100 Dokumente/Monat', 'Basis-Templates', 'Email-Support', 'Community Access'],
                cta: 'Kostenlos starten'
              },
              {
                name: 'Professional',
                price: '€299',
                period: '/Monat',
                description: 'Für wachsende Teams',
                features: ['Unlimited Dokumente', 'Advanced Templates', 'Priority Support', 'Integrations', 'Analytics'],
                cta: 'Jetzt starten',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Individuell',
                description: 'Für große Organisationen',
                features: ['Custom Solutions', 'Dedicated Account Manager', '24/7 Support', 'SLA Guarantee', 'On-Premise Option'],
                cta: 'Kontaktieren Sie uns'
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-xl p-8 ${plan.highlighted ? 'bg-primary-600 text-white border-2 border-primary-600 transform scale-105' : 'bg-gray-50 border-2 border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? '' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.highlighted ? '' : 'text-gray-900'}`}>{plan.price}</span>
                  {plan.period && <span className={plan.highlighted ? '' : 'text-gray-600'}>{plan.period}</span>}
                </div>
                <p className={`mb-6 text-sm ${plan.highlighted ? 'text-primary-50' : 'text-gray-600'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex gap-2">
                      <span className={plan.highlighted ? '✓' : '✓'} style={{ color: plan.highlighted ? 'white' : '#0284c7' }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={plan.highlighted ? 'btn-secondary w-full text-primary-600' : 'btn-primary w-full'}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-max max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="section-heading">Bereit zu starten?</h2>
            <p className="section-subheading">
              Treten Sie unserer Warteliste bei und erhalten Sie Zugang zu unseren Services mit Early-Bird-Rabatten.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="container-max max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Häufig gestellte Fragen</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Wie lange dauert die Implementierung?',
                a: 'Bei unseren Managed Services dauert die Implementierung typischerweise 2-4 Wochen. Mit unserer SaaS-Plattform können Sie sofort starten.'
              },
              {
                q: 'Ist meine Daten sicher?',
                a: 'Ja, wir sind DSGVO-konform und setzen Bank-Level Verschlüsselung ein. Ihre Daten werden entweder bei Ihnen lokal oder auf deutschen Servern gespeichert.'
              },
              {
                q: 'Welche Systeme integrieren Sie?',
                a: 'Wir integrieren mit SAP, NetSuite, Microsoft Dynamics, Salesforce und über 500 weiteren Tools via APIs und Zapier.'
              },
              {
                q: 'Was ist, wenn etwas nicht funktioniert?',
                a: 'Unser Support-Team ist auf Deutsch verfügbar und antwortet innerhalb von 24 Stunden. Bei Managed Services haben Sie einen dedizierten Account Manager.'
              },
              {
                q: 'Kann ich jederzeit kündigen?',
                a: 'Bei unserer SaaS-Plattform können Sie jederzeit mit 30 Tagen Kündigungsfrist kündigen. Bei Managed Services ist eine individuelle Vereinbarung möglich.'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">{item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
