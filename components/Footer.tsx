import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-base sm:text-lg">Cappai</span>
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
                <a href="mailto:info@cappai-ug.de" className="hover:text-white transition-colors break-all">
                  info@cappai-ug.de
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

        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 Cappai UG (haftungsbeschränkt). Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
