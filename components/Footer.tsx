import Link from 'next/link'
import Image from 'next/image'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-max py-8 sm:py-12">
        {/* Newsletter signup band */}
        <div className="bg-blue-950/50 border border-blue-900 rounded-2xl p-6 sm:p-8 mb-8 max-w-3xl mx-auto">
          <NewsletterSignup
            wrapper="bare"
            theme="dark"
            heading="OPTIMAZED-Newsletter"
            description="Ca. 1 Mail pro Woche mit Tipps zu KI-Automatisierung, neuen Blog-Artikeln und Branchen-Updates. Abmeldung jederzeit möglich."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <Image
                src="/images/logo.svg"
                alt="OPTIMAZED Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">KI-Automatisierung für deutsche Unternehmen.</p>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#services" className="hover:text-white transition-colors">Dokumentenautomatisierung</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Kundenservice-KI</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">SaaS Plattform</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base">Rechtliches</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/cookie-richtlinie" className="hover:text-white transition-colors">Cookie-Richtlinie</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base">Kontakt</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:hello@optimazed.de" className="hover:text-white transition-colors break-all">
                  hello@optimazed.de
                </a>
              </li>
              <li className="leading-relaxed">
                Freiherr-vom-Stein-Str 14a<br />
                61440 Oberursel<br />
                Deutschland
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2026 OPTIMAZED. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
