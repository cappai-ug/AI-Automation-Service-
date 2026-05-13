'use client'

import { useState } from 'react'

type Props = {
  source?: string
  wrapper?: 'card' | 'bare'
  theme?: 'light' | 'dark'
  heading?: string
  description?: string
  consentText?: string
  ctaLabel?: string
  showName?: boolean
}

const DEFAULT_CONSENT =
  'Ja, ich möchte den OPTIMAZED-Newsletter mit Tipps zu KI-Automatisierung und neuen Blogartikeln erhalten. Ich kann mich jederzeit über den Link in jeder Mail abmelden.'

export default function NewsletterSignup({
  source = 'newsletter_form',
  wrapper = 'card',
  theme = 'light',
  heading = 'Newsletter abonnieren',
  description = 'Ca. 1 Mail pro Woche mit praxisnahen Tipps zu KI-Automatisierung, neuen Blog-Artikeln und Branchen-Updates.',
  consentText = DEFAULT_CONSENT,
  ctaLabel = 'Anmelden',
  showName = false,
}: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    if (!consent) {
      setMessage('Bitte stimmen Sie der Einwilligung zu.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setMessage(null)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: showName ? name : undefined,
          source,
          consent: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Anmeldung fehlgeschlagen')
      setStatus('success')
      setMessage(data.message || 'Bitte prüfen Sie Ihren Posteingang.')
      setEmail('')
      setName('')
      setConsent(false)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Anmeldung fehlgeschlagen.')
    }
  }

  const isDark = theme === 'dark'
  const headingClass = isDark
    ? 'text-lg font-bold text-white mb-2'
    : 'text-xl font-bold text-navy mb-2'
  const descriptionClass = isDark
    ? 'text-sm text-gray-300 mb-4'
    : 'text-sm text-gray-600 mb-5'
  const inputClass = isDark
    ? 'w-full border border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-lg px-3 py-2'
    : 'w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900'
  const consentClass = isDark
    ? 'flex items-start gap-2 text-xs text-gray-300 cursor-pointer'
    : 'flex items-start gap-2 text-xs text-gray-600 cursor-pointer'
  const successClass = isDark ? 'text-green-300' : 'text-green-700'
  const errorClass = isDark ? 'text-red-300' : 'text-red-600'

  const wrapperClass =
    wrapper === 'card' ? 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6' : ''

  return (
    <div className={wrapperClass}>
      {heading && <h3 className={headingClass}>{heading}</h3>}
      {description && <p className={descriptionClass}>{description}</p>}

      <form onSubmit={submit} className="space-y-3">
        {showName && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ihr Name (optional)"
            className={inputClass}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="ihre@email.de"
          className={inputClass}
        />
        <label className={consentClass}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 flex-shrink-0"
          />
          <span>
            {consentText}{' '}
            <a
              href="/datenschutz"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-accent"
            >
              Datenschutzerklärung
            </a>
            .
          </span>
        </label>
        <button
          type="submit"
          disabled={status === 'loading' || !consent}
          className="w-full px-5 py-2.5 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Sende…' : ctaLabel}
        </button>

        {message && (
          <p className={`text-sm ${status === 'success' ? successClass : errorClass}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
