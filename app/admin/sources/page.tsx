'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FeedSource {
  id: string
  name: string
  url: string
  enabled: boolean
  category: string | null
  lastFetchedAt: string | null
  lastError: string | null
  createdAt: string
  _count: { items: number }
}

const CATEGORY_OPTIONS = [
  { value: '', label: '— keine —' },
  { value: 'ratgeber', label: 'Ratgeber' },
  { value: 'branchen', label: 'Branchen' },
  { value: 'technologie', label: 'Technologie' },
]

export default function SourcesAdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [sources, setSources] = useState<FeedSource[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

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
      const res = await fetch('/api/admin/sources')
      const data = await res.json()
      setSources(Array.isArray(data) ? data : [])
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

  async function addSource(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          url: newUrl.trim(),
          category: newCategory || null,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Fehler ${res.status}`)
      }
      setNewName('')
      setNewUrl('')
      setNewCategory('')
      await load()
    } catch (err: any) {
      setError(err.message || 'Fehler beim Anlegen')
    } finally {
      setBusy(false)
    }
  }

  async function toggleEnabled(source: FeedSource) {
    await fetch(`/api/admin/sources/${source.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !source.enabled }),
    })
    await load()
  }

  async function remove(source: FeedSource) {
    if (!confirm(`Quelle "${source.name}" wirklich löschen?`)) return
    await fetch(`/api/admin/sources/${source.id}`, { method: 'DELETE' })
    await load()
  }

  async function fetchNow() {
    setBusy(true)
    try {
      const res = await fetch('/api/cron/fetch-feeds')
      const data = await res.json()
      alert(
        `Fetch abgeschlossen.\n\n` +
          (data.sources ?? [])
            .map(
              (s: any) =>
                `${s.source}: ${s.inserted} neu / ${s.fetched} gesehen${
                  s.error ? ` (Fehler: ${s.error})` : ''
                }`
            )
            .join('\n')
      )
      await load()
    } catch (err: any) {
      alert(`Fetch fehlgeschlagen: ${err.message}`)
    } finally {
      setBusy(false)
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
            <h1 className="text-3xl font-bold text-navy">RSS-Quellen</h1>
            <p className="text-gray-600 mt-1">
              Externe Feeds, aus denen Themenideen für den Blog gesammelt werden.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/feed-items"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Items ansehen
            </Link>
            <Link
              href="/admin/drafts"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              KI-Drafts
            </Link>
            <button
              onClick={fetchNow}
              disabled={busy}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              {busy ? 'Lade…' : 'Jetzt abrufen'}
            </button>
          </div>
        </div>

        <form
          onSubmit={addSource}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 grid gap-4 sm:grid-cols-4"
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (z.B. heise online)"
            className="border border-gray-300 rounded-lg px-3 py-2 sm:col-span-1"
            required
          />
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="border border-gray-300 rounded-lg px-3 py-2 sm:col-span-2"
            required
          />
          <div className="flex gap-2 sm:col-span-1">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 flex-1"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 bg-navy text-white rounded-lg font-medium disabled:opacity-50"
            >
              Hinzufügen
            </button>
          </div>
          {error && (
            <div className="sm:col-span-4 text-red-600 text-sm">{error}</div>
          )}
        </form>

        {loading ? (
          <p className="text-gray-500">Lade…</p>
        ) : sources.length === 0 ? (
          <p className="text-gray-500">Noch keine RSS-Quellen angelegt.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Kategorie</th>
                  <th className="px-4 py-3 text-right">Items</th>
                  <th className="px-4 py-3">Letzter Fetch</th>
                  <th className="px-4 py-3">Aktiv</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {s.url}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.category || '—'}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {s._count?.items ?? 0}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.lastFetchedAt
                        ? new Date(s.lastFetchedAt).toLocaleString('de-DE')
                        : '—'}
                      {s.lastError && (
                        <div className="text-xs text-red-600 mt-1 truncate" title={s.lastError}>
                          {s.lastError}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleEnabled(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {s.enabled ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => remove(s)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Löschen
                      </button>
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
