import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cappai - AI-Automatisierung für deutsche Unternehmen',
  description: 'Automatisieren Sie Ihre Geschäftsprozesse mit KI. Dokumentenverarbeitung, Kundenkommunikation, Sales-Automatisierung für KMUs.',
  keywords: 'AI Automation, KI Automatisierung, Dokumentenverarbeitung, Business Process Automation, Deutschland',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Cappai - AI-Automatisierung für deutsche Unternehmen',
    description: 'Automatisieren Sie Ihre Geschäftsprozesse mit KI',
    type: 'website',
    url: 'https://cappai-ug.de',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
