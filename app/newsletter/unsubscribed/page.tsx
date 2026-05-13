import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Newsletter abgemeldet | OPTIMAZED',
  robots: 'noindex, nofollow',
}

const MESSAGES = {
  ok: {
    title: 'Abmeldung bestätigt',
    body: 'Sie sind aus unserem Newsletter abgemeldet. Sie erhalten ab sofort keine Newsletter-Mails mehr von uns. Falls das ein Versehen war, können Sie sich jederzeit erneut anmelden.',
  },
  invalid: {
    title: 'Link nicht gültig',
    body: 'Der Abmeldelink konnte keiner Anmeldung zugeordnet werden. Vielleicht haben Sie sich bereits abgemeldet.',
  },
  error: {
    title: 'Etwas ist schiefgelaufen',
    body: 'Der Link war ungültig oder unvollständig. Bitte kontaktieren Sie uns, wenn Sie weiterhin E-Mails erhalten.',
  },
}

export default function NewsletterUnsubscribedPage({
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
          <Link
            href="/"
            className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-blue-900 inline-block"
          >
            Zur Startseite
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
