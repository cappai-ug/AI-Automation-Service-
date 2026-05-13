import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Newsletter bestätigt | OPTIMAZED',
  robots: 'noindex, nofollow',
}

const MESSAGES = {
  ok: {
    title: 'Anmeldung bestätigt ✓',
    body: 'Vielen Dank. Sie sind jetzt für den OPTIMAZED-Newsletter angemeldet. Eine Willkommens-E-Mail mit den Details (inkl. Download falls Sie eine Checkliste angefordert haben) ist auf dem Weg in Ihr Postfach.',
  },
  already: {
    title: 'Bereits bestätigt',
    body: 'Diese Anmeldung wurde bereits bestätigt. Falls Sie die letzte Newsletter-Ausgabe verpasst haben, schauen Sie kurz in Ihrem Spam-Ordner nach.',
  },
  invalid: {
    title: 'Link nicht mehr gültig',
    body: 'Der Bestätigungslink konnte keiner Anmeldung zugeordnet werden. Möglicherweise ist er abgelaufen. Sie können sich gerne erneut anmelden.',
  },
  error: {
    title: 'Etwas ist schiefgelaufen',
    body: 'Der Link war ungültig oder unvollständig. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.',
  },
}

export default function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = (searchParams.status as keyof typeof MESSAGES) || 'ok'
  const message = MESSAGES[status] ?? MESSAGES.ok

  return (
    <main className="bg-white">
      <Header />
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">{message.title}</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{message.body}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-blue-900"
            >
              Zur Startseite
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
            >
              Zum Blog
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
