import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OPTIMAZED - KI Automatisierung für deutsche Unternehmen | AI-Lösungen',
  description: 'OPTIMAZED automatisiert Ihre Geschäftsprozesse mit künstlicher Intelligenz. KI-Rezeptionist, Email-Automatisierung, Lead-Qualifizierung für Praxen, Kanzleien, Agenturen.',
  keywords: 'KI Automatisierung, Artificial Intelligence, AI Automation, Geschäftsprozess-Automatisierung, KI Rezeptionist, Email Automatisierung, Lead Qualification, Machine Learning, Deutschland, Business Process Automation',
  metadataBase: new URL('https://www.optimazed.de'),
  alternates: {
    canonical: 'https://www.optimazed.de',
    types: {
      'application/rss+xml': [
        { url: 'https://www.optimazed.de/feed.xml', title: 'OPTIMAZED Blog RSS' },
      ],
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'OPTIMAZED - KI Automatisierung für deutsche Unternehmen',
    description: 'Automatisieren Sie Ihre Geschäftsprozesse mit künstlicher Intelligenz. KI-Rezeptionist, Email-Automatisierung, Lead-Qualifizierung.',
    type: 'website',
    url: 'https://www.optimazed.de',
    siteName: 'OPTIMAZED',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPTIMAZED - KI Automatisierung',
    description: 'Geschäftsprozess-Automatisierung mit künstlicher Intelligenz',
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  applicationName: 'OPTIMAZED',
  category: 'Software',
  creator: 'OPTIMAZED',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              'name': 'OPTIMAZED',
              'description': 'KI-Automatisierung für Geschäftsprozesse in deutschen Unternehmen',
              'url': 'https://www.optimazed.de',
              'applicationCategory': 'BusinessApplication',
              'offers': {
                '@type': 'AggregateOffer',
                'priceCurrency': 'EUR',
                'price': '299',
              },
              'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.8',
                'ratingCount': '100',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'OPTIMAZED',
              'url': 'https://www.optimazed.de',
              'description': 'Künstliche Intelligenz Automatisierung für deutsche Unternehmen',
              'sameAs': [
                'https://www.optimazed.de',
              ],
              'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'Sales',
                'availableLanguage': 'de',
              },
            }),
          }}
        />
      </head>
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
