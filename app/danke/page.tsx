import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThankYouTracking from './ThankYouTracking'

export const metadata: Metadata = {
  // Important: not indexed — would otherwise rank as a "thank-you" snippet
  title: 'Vielen Dank | OPTIMAZED',
  robots: 'noindex, nofollow',
}

const MESSAGES: Record<
  string,
  { title: string; body: string; next?: { label: string; href: string } }
> = {
  waitlist: {
    title: 'Vielen Dank für Ihre Anfrage',
    body: 'Wir haben Ihre Nachricht erhalten und melden uns innerhalb der nächsten 24 Stunden persönlich bei Ihnen mit konkreten nächsten Schritten.',
    next: { label: 'Inzwischen: Gratis-Checkliste', href: '/#lead-magnet' },
  },
  'lead-magnet': {
    title: 'Fast geschafft — bitte E-Mail bestätigen',
    body: 'Wir haben Ihnen einen Bestätigungslink an Ihre E-Mail geschickt. Klicken Sie darauf, und Sie bekommen sofort den Download-Link zur Checkliste — plus den ersten Newsletter.',
    next: { label: 'Zum Blog', href: '/blog' },
  },
  newsletter: {
    title: 'Danke — bitte E-Mail bestätigen',
    body: 'Wir haben Ihnen einen Bestätigungslink geschickt. Erst nach Klick auf den Link kommt der Newsletter bei Ihnen an — das ist gesetzlich vorgeschrieben.',
    next: { label: 'Zum Blog', href: '/blog' },
  },
  contact: {
    title: 'Danke für Ihre Nachricht!',
    body: 'Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.',
    next: { label: 'Zur Startseite', href: '/' },
  },
  default: {
    title: 'Vielen Dank!',
    body: 'Wir haben Ihre Anfrage erhalten.',
    next: { label: 'Zur Startseite', href: '/' },
  },
}

export default function DankePage({
  searchParams,
}: {
  searchParams: { typ?: string }
}) {
  const key = (searchParams.typ ?? 'default') as keyof typeof MESSAGES
  const msg = MESSAGES[key] ?? MESSAGES.default

  return (
    <main className="bg-white">
      <Header />
      <ThankYouTracking type={key} />
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">{msg.title}</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{msg.body}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-blue-900"
            >
              Zur Startseite
            </Link>
            {msg.next && (
              <Link
                href={msg.next.href}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                {msg.next.label}
              </Link>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
