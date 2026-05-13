'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Draft {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  contentMarkdown: string
  relevanceScore: number
  status: string
  model: string | null
  generatedAt: string
  sourceItem: {
    id: string
    title: string
    link: string
    source: { name: string }
  } | null
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'draft', label: 'Entwurf' },
  { value: 'approved', label: 'Freigegeben' },
  { value: 'published', label: 'Veröffentlicht' },
  { value: 'rejected', label: 'Verworfen' },
]

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-200 text-gray-600',
}

const CATEGORY_LABEL: Record<string, string> = {
  ratgeber: 'Ratgeber',
  branchen: 'Branchen',
  technologie: 'Technologie',
}

export default function DraftsAdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

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
      const res = await fetch(`/api/admin/drafts?${params}`)
      const data = await res.json()
      setDrafts(Array.isArray(data) ? data : [])
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

  async function generateNow() {
    if (!confirm('Drafts generieren? Dies kostet API-Tokens (Claude Opus 4.7).')) return
    setGenerating(true)
    try {
      const res = await fetch('/api/cron/generate-drafts?limit=3')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`)
      const msg = (data.results ?? [])
        .map(
          (r: any) =>
            `${r.status === 'created' ? '✓' : '✗'} ${r.title}` +
            (r.relevanceScore !== undefined ? ` (Score ${r.relevanceScore})` : '') +
            (r.error ? ` — ${r.error}` : '')
        )
        .join('\n')
      alert(`${data.processed} Item(s) verarbeitet:\n\n${msg || '(keine Items zu verarbeiten)'}`)
      await load()
    } catch (err: any) {
      alert(`Fehler: ${err.message}`)
    } finally {
      setGenerating(false)
    }
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">KI-Drafts</h1>
            <p className="text-gray-600 mt-1">
              Mit Claude generierte Blogartikel-Entwürfe. Bearbeiten & Veröffentlichen folgt in Phase 3.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/sources"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Quellen
            </Link>
            <Link
              href="/admin/feed-items"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Feed-Items
            </Link>
            <button
              onClick={generateNow}
              disabled={generating}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              {generating ? 'Generiere…' : 'Drafts generieren'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Status: {o.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Lade…</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-500">
            Noch keine Drafts. Klicke „Drafts generieren" — oder warte auf den nächsten Cron-Lauf.
          </p>
        ) : (
          <div className="space-y-4">
            {drafts.map((d) => (
              <article
                key={d.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                        STATUS_STYLE[d.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {d.status}
                    </span>
                    <span className="text-accent font-semibold uppercase">
                      {CATEGORY_LABEL[d.category] ?? d.category}
                    </span>
                    <span className="text-gray-500">
                      Relevanz {d.relevanceScore}/10
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date(d.generatedAt).toLocaleString('de-DE')}
                    </span>
                    {d.model && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{d.model}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-navy mb-1">{d.title}</h2>
                  <div className="text-xs text-gray-500 mb-3 font-mono">/{d.slug}</div>
                  <p className="text-gray-700 mb-3">{d.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  {d.sourceItem && (
                    <div className="text-xs text-gray-500 mb-3">
                      Quelle: <span className="font-medium">{d.sourceItem.source.name}</span> ·{' '}
                      <a
                        href={d.sourceItem.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline"
                      >
                        {d.sourceItem.title}
                      </a>
                    </div>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                    className="text-sm text-accent hover:underline"
                  >
                    {expanded === d.id ? 'Inhalt ausblenden' : 'Inhalt anzeigen'}
                  </button>
                </div>
                {expanded === d.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800 leading-relaxed">
                      {d.contentMarkdown}
                    </pre>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
