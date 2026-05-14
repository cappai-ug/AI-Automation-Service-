'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  leads: { total: number; new: number }
  sources: { total: number; enabled: number; errored: number }
  feedItems: { total: number; unprocessed: number; highScore: number }
  drafts: { total: number; draft: number; published: number; rejected: number }
  newsletter: { total: number; confirmed: number; pending: number; unsubscribed: number }
}

interface DiagnoseCheck {
  name: string
  ok: boolean
  detail: string
}

interface Diagnose {
  ok: boolean
  timestamp: string
  checks: DiagnoseCheck[]
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [diagnose, setDiagnose] = useState<Diagnose | null>(null)
  const [diagnoseLoading, setDiagnoseLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated') === 'true'
    if (auth) {
      setAuthenticated(true)
      void load()
    } else {
      setLoading(false)
    }
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setStats(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }

  async function runDiagnose() {
    setDiagnoseLoading(true)
    try {
      const res = await fetch('/api/admin/diagnose')
      const data = await res.json()
      setDiagnose(data)
    } catch (err: any) {
      setDiagnose({
        ok: false,
        timestamp: new Date().toISOString(),
        checks: [{ name: 'Diagnose', ok: false, detail: err?.message ?? String(err) }],
      })
    } finally {
      setDiagnoseLoading(false)
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

  function logout() {
    localStorage.removeItem('admin_authenticated')
    setAuthenticated(false)
    setStats(null)
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-navy mb-2">OPTIMAZED Admin</h1>
          <p className="text-sm text-gray-500 mb-6">Bitte einloggen.</p>
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

  const cards = [
    {
      title: 'Leads',
      description: 'Anmeldungen aus der Waitlist verwalten.',
      href: '/admin/leads',
      color: 'from-blue-500 to-blue-700',
      stats: stats
        ? [
            { label: 'Gesamt', value: stats.leads.total },
            { label: 'Neu', value: stats.leads.new },
          ]
        : [],
    },
    {
      title: 'RSS-Quellen',
      description: 'Externe Feeds für die Themenfindung.',
      href: '/admin/sources',
      color: 'from-purple-500 to-purple-700',
      stats: stats
        ? [
            { label: 'Aktiv', value: stats.sources.enabled },
            { label: 'Gesamt', value: stats.sources.total },
            {
              label: 'Fehler',
              value: stats.sources.errored,
              danger: stats.sources.errored > 0,
            },
          ]
        : [],
    },
    {
      title: 'Feed-Items',
      description: 'Gesammelte Nachrichten aus den RSS-Quellen.',
      href: '/admin/feed-items',
      color: 'from-cyan-500 to-cyan-700',
      stats: stats
        ? [
            { label: 'Gesamt', value: stats.feedItems.total },
            { label: 'Unverarbeitet', value: stats.feedItems.unprocessed },
            { label: 'Score ≥ 6', value: stats.feedItems.highScore },
          ]
        : [],
    },
    {
      title: 'KI-Drafts',
      description: 'Mit Claude generierte Blog-Entwürfe.',
      href: '/admin/drafts',
      color: 'from-amber-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Entwurf', value: stats.drafts.draft },
            { label: 'Live', value: stats.drafts.published },
            { label: 'Gesamt', value: stats.drafts.total },
          ]
        : [],
    },
    {
      title: 'Newsletter',
      description: 'Abonnenten verwalten und Kampagnen versenden.',
      href: '/admin/newsletter',
      color: 'from-emerald-500 to-teal-600',
      stats: stats
        ? [
            { label: 'Bestätigt', value: stats.newsletter.confirmed },
            { label: 'Wartet', value: stats.newsletter.pending },
            { label: 'Abgemeldet', value: stats.newsletter.unsubscribed },
          ]
        : [],
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy">OPTIMAZED Admin</h1>
            <p className="text-sm text-gray-500">
              Übersicht und Verwaltung von Leads, Quellen und Blog-Inhalten.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Zur Website
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-6">
                <h2 className="text-xl font-bold text-navy mb-1 group-hover:text-accent transition-colors">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600 mb-5">{card.description}</p>
                {loading ? (
                  <div className="text-sm text-gray-400">Lade Zahlen…</div>
                ) : card.stats.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {card.stats.map((s) => (
                      <div key={s.label}>
                        <div
                          className={`text-2xl font-bold ${
                            (s as any).danger ? 'text-red-600' : 'text-navy'
                          }`}
                        >
                          {s.value}
                        </div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Keine Daten verfügbar.</div>
                )}
                <div className="mt-5 text-sm font-medium text-accent group-hover:underline">
                  Öffnen →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Diagnose */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold text-navy">System-Diagnose</h2>
            <button
              onClick={runDiagnose}
              disabled={diagnoseLoading}
              className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              {diagnoseLoading ? 'Prüfe…' : 'Jetzt prüfen'}
            </button>
          </div>
          {diagnose ? (
            <div className="space-y-2">
              <p
                className={`text-sm font-medium ${
                  diagnose.ok ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {diagnose.ok
                  ? '✓ Alle Checks bestanden'
                  : '⚠ Ein oder mehrere Probleme erkannt'}
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {diagnose.checks.map((c) => (
                    <tr key={c.name} className="border-t border-gray-100">
                      <td className="py-2 pr-3 font-medium align-top w-44">
                        <span className={c.ok ? 'text-green-700' : 'text-red-700'}>
                          {c.ok ? '✓' : '✗'}
                        </span>{' '}
                        {c.name}
                      </td>
                      <td className="py-2 text-gray-600 break-all">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2">
                Letzte Prüfung: {new Date(diagnose.timestamp).toLocaleString('de-DE')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Klicke „Jetzt prüfen", wenn Generation oder andere Funktionen nicht laufen.
              Zeigt Env-Vars, DB-Verbindung, Anthropic-API-Erreichbarkeit und Queue-Status.
            </p>
          )}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-navy mb-3">Cron-Pipeline (täglich)</h2>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>
              <span className="font-medium">06:00 UTC</span> · RSS-Feeds einlesen → neue
              Items in DB
            </li>
            <li>
              <span className="font-medium">06:30 UTC</span> · Keyword-Filter → Haiku-Scoring →
              Opus generiert bis zu 3 Drafts
            </li>
            <li>
              <span className="font-medium">Manuell</span> · Du reviewst die Drafts und
              klickst „Veröffentlichen"
            </li>
            <li>
              <span className="font-medium">Innerhalb von 60s</span> · Artikel ist live unter{' '}
              <code className="bg-gray-100 px-1 rounded">/blog/...</code>
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}
