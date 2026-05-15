import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPrisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Newsletter-Anmeldung bestätigen | OPTIMAZED',
  robots: 'noindex, nofollow',
}

// Page is dynamic — it reads searchParams and queries the DB.
export const dynamic = 'force-dynamic'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    return (
      <Shell
        title="Link unvollständig"
        body="Der Bestätigungslink enthielt keinen Token. Bitte verwenden Sie den Link aus der E-Mail."
      />
    )
  }

  // Look up the subscriber without modifying anything — so email scanners
  // and prefetchers can hit this page without effect.
  let subscriber: { email: string; status: string } | null = null
  try {
    subscriber = await getPrisma().newsletterSubscriber.findUnique({
      where: { confirmToken: token },
      select: { email: true, status: true },
    })
  } catch (err) {
    console.error('Confirm page lookup failed:', err)
  }

  if (!subscriber) {
    return (
      <Shell
        title="Link nicht mehr gültig"
        body="Der Bestätigungslink konnte keiner Anmeldung zugeordnet werden. Möglicherweise ist er abgelaufen. Sie können sich gerne erneut anmelden."
      />
    )
  }

  if (subscriber.status === 'confirmed') {
    return (
      <Shell
        title="Bereits bestätigt"
        body="Diese Anmeldung wurde bereits bestätigt. Sie erhalten unseren Newsletter wie gewünscht."
      />
    )
  }

  // pending / unsubscribed — show the active confirm button.
  return (
    <main className="bg-white">
      <Header />
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Newsletter-Anmeldung bestätigen
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Klicken Sie auf den Button, um die Anmeldung für{' '}
            <strong className="text-navy">{subscriber.email}</strong> zu bestätigen.
            Anschließend erhalten Sie Ihre Willkommens-E-Mail (inkl. Download, falls Sie
            eine Checkliste angefordert haben).
          </p>
          <form method="POST" action={`/api/newsletter/confirm?token=${encodeURIComponent(token)}`}>
            <button
              type="submit"
              className="px-8 py-3 bg-accent hover:bg-blue-600 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Anmeldung bestätigen
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-6">
            Die Bestätigung erfolgt erst nach Klick auf den Button. Ohne diesen Schritt
            werden Sie nicht in den Verteiler aufgenommen.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}

function Shell({ title, body }: { title: string; body: string }) {
  return (
    <main className="bg-white">
      <Header />
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">{title}</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{body}</p>
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
