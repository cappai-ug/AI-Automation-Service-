import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold text-lg">Cappai</span>
            </div>
            <p className="text-gray-400">KI-Automatisierung für deutsche Unternehmen.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#services" className="hover:text-white transition-colors">Dokumentenautomatisierung</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Kundenservice-KI</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">SaaS Plattform</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/cookie-richtlinie" className="hover:text-white transition-colors">Cookie-Richtlinie</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:info@cappai-ug.de" className="hover:text-white transition-colors">info@cappai-ug.de</a></li>
              <li>Freiherr-vom-Stein-Str 14a<br/>61440 Oberursel, Deutschland</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Cappai UG (haftungsbeschränkt). Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
