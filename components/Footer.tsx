import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-max py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="2.5" fill="white"/>
                  <circle cx="16" cy="14" r="2.5" fill="white"/>
                  <circle cx="12" cy="20" r="2.5" fill="white"/>
                  <circle cx="8" cy="14" r="2.5" fill="white"/>
                  <path d="M12 8 Q14 10 16 14 Q14 18 12 20 Q10 18 8 14 Q10 10 12 8" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <span className="font-bold text-base sm:text-lg">OPTIMIZED</span>
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

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 OPTIMIZED (haftungsbeschränkt). Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
