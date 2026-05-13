'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Subscriber {
  id: string
  email: string
  name: string | null
  source: string
  status: string
  subscribedAt: string
  confirmedAt: string | null
  unsubscribedAt: string | null
  lastSentAt: string | null
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  unsubscribed: 'bg-gray-200 text-gray-600',
}

export default function NewsletterAdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const [subject, setSubject] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated') === 'true'
    if (auth) {
      setAuthenticated(true)
      void load()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) void load()
  }, [statusFilter, authenticated])

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/newsletter?${params}`)
      const data = await res.json()
      setSubscribers(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true')
      setAuthenticated(true)
      setPassword('')
      void load()
    } else {
      alert('Falsches Passwort')
    }
  }

  async function preview() {
    const res = await fetch('/api/admin/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, bodyText, bodyHtml, dryRun: true }),
    })
    const data = await res.json()
    if (!res.ok) {
      setSendResult(`Fehler: ${data.error}`)
      return
    }
    setSendResult(data.message)
  }

  async function send() {
    if (
      !confirm(
        `Newsletter wirklich an alle bestätigten Abonnenten senden?\n\nBetreff: ${subject}`
      )
    )
      return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, bodyText, bodyHtml }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`)
      setSendResult(
        `Versand abgeschlossen: ${data.sent} gesendet, ${data.failed} fehlgeschlagen ` +
          `(von ${data.recipientCount} Empfängern).` +
          (data.failures?.length
            ? `\n\nFehler: ${data.failures.map((f: any) => `${f.email}: ${f.error}`).join('; ')}`
            : '')
      )
      setSubject('')
      setBodyText('')
      setBodyHtml('')
      await load()
    } catch (err: any) {
      setSendResult(`Fehler: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  const counts = {
    confirmed: subscribers.filter((s) => s.status === 'confirmed').length,
    pending: subscribers.filter((s) => s.status === 'pending').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-navy mb-6">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-navy text-white font-medium rounded-lg py-2 hover:bg-blue-900"
          >
            Anmelden
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-accent hover:underline mb-2 inline-block">
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-navy">Newsletter</h1>
          <p className="text-gray-600 mt-1">
            Abonnenten verwalten und Kampagnen versenden.
          </p>
        </div>

        {/* Compose */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-navy mb-1">Newsletter verfassen</h2>
          <p className="text-sm text-gray-600 mb-4">
            Geht an alle bestätigten Abonnenten ({counts.confirmed}). Abmelde-Link wird automatisch angehängt.
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Betreff"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder={`Plaintext-Version (oder leer lassen, wenn nur HTML)`}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
            />
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              placeholder={`HTML-Inhalt (z.B. <h2>Titel</h2><p>Text...</p>)\nLeer lassen wenn Plaintext genügt.`}
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
            />
            <div className="flex gap-3 flex-wrap items-center">
              <button
                onClick={preview}
                disabled={sending}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Empfänger zählen (Trockenlauf)
              </button>
              <button
                onClick={send}
                disabled={sending || !subject.trim() || (!bodyText.trim() && !bodyHtml.trim())}
                className="px-5 py-2 bg-accent text-white font-medium rounded-lg disabled:opacity-50 hover:bg-blue-600"
              >
                {sending ? 'Sende…' : `An ${counts.confirmed} Abonnenten senden`}
              </button>
            </div>
            {sendResult && (
              <pre className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs whitespace-pre-wrap">
                {sendResult}
              </pre>
            )}
          </div>
        </div>

        {/* Filters + stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Alle</option>
            <option value="confirmed">Bestätigt</option>
            <option value="pending">Wartet auf Bestätigung</option>
            <option value="unsubscribed">Abgemeldet</option>
          </select>
          <div className="text-sm text-gray-600 flex gap-4 flex-wrap ml-auto">
            <span>
              ✓ Bestätigt: <span className="font-semibold text-navy">{counts.confirmed}</span>
            </span>
            <span>
              ⏳ Wartet: <span className="font-semibold text-yellow-700">{counts.pending}</span>
            </span>
            <span>
              ✗ Abgemeldet: <span className="font-semibold text-gray-500">{counts.unsubscribed}</span>
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Lade…</p>
        ) : subscribers.length === 0 ? (
          <p className="text-gray-500">Noch keine Abonnenten.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">E-Mail</th>
                  <th className="px-4 py-3">Quelle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Angemeldet</th>
                  <th className="px-4 py-3">Bestätigt</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-navy">
                      {s.email}
                      {s.name && <div className="text-xs text-gray-500">{s.name}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.source}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_STYLE[s.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(s.subscribedAt).toLocaleString('de-DE')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                      {s.confirmedAt
                        ? new Date(s.confirmedAt).toLocaleString('de-DE')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
