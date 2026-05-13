'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FeedItem {
  id: string
  title: string
  link: string
  description: string | null
  publishedAt: string | null
  fetchedAt: string
  processed: boolean
  relevanceScore: number | null
  scoredAt: string | null
  skipReason: string | null
  source: { id: string; name: string; category: string | null }
}

interface FeedSource {
  id: string
  name: string
}

export default function FeedItemsAdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [items, setItems] = useState<FeedItem[]>([])
  const [sources, setSources] = useState<FeedSource[]>([])
  const [sourceId, setSourceId] = useState('')
  const [processedFilter, setProcessedFilter] = useState('')
  const [minScore, setMinScore] = useState('')
  const [sort, setSort] = useState<'recent' | 'score'>('recent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated') === 'true'
    if (auth) {
      setAuthenticated(true)
      void loadSources()
      void load()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) void load()
  }, [sourceId, processedFilter, minScore, sort, authenticated])

  async function loadSources() {
    const res = await fetch('/api/admin/sources')
    if (res.ok) {
      const data = await res.json()
      setSources(Array.isArray(data) ? data : [])
    }
  }

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (sourceId) params.set('sourceId', sourceId)
      if (processedFilter) params.set('processed', processedFilter)
      if (minScore) params.set('minScore', minScore)
      params.set('sort', sort)
      params.set('limit', '200')
      const res = await fetch(`/api/admin/feed-items?${params}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
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
      void loadSources()
      void load()
    } else {
      alert('Falsches Passwort')
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
            <Link href="/admin" className="text-sm text-accent hover:underline mb-2 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-navy">Feed-Items</h1>
            <p className="text-gray-600 mt-1">
              Gesammelte Artikel aus den RSS-Quellen — Quelle für künftige Blog-Themen.
            </p>
          </div>
          <Link
            href="/admin/sources"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Quellen verwalten
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Alle Quellen</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={processedFilter}
            onChange={(e) => setProcessedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Status: alle</option>
            <option value="false">Unverarbeitet</option>
            <option value="true">Verarbeitet</option>
          </select>
          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Score: alle</option>
            <option value="6">Score ≥ 6 (relevant)</option>
            <option value="8">Score ≥ 8 (sehr gut)</option>
            <option value="9">Score ≥ 9 (perfekt)</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'recent' | 'score')}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="recent">Sortierung: neueste</option>
            <option value="score">Sortierung: Relevanz</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Lade…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Noch keine Items vorhanden. Klicke in „Quellen verwalten" auf „Jetzt abrufen".</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const score = item.relevanceScore
              const scoreStyle =
                score == null
                  ? 'bg-gray-100 text-gray-500'
                  : score >= 8
                    ? 'bg-green-100 text-green-800'
                    : score >= 6
                      ? 'bg-blue-100 text-blue-800'
                      : score >= 3
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-700'
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${scoreStyle}`}
                      title={
                        score == null
                          ? 'Noch nicht bewertet'
                          : `Haiku-Relevanz: ${score}/10`
                      }
                    >
                      {score == null ? '—' : `${score}/10`}
                    </span>
                    <span className="font-semibold text-accent">{item.source.name}</span>
                    {item.source.category && (
                      <>
                        <span>•</span>
                        <span>{item.source.category}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString('de-DE')
                        : new Date(item.fetchedAt).toLocaleDateString('de-DE')}
                    </span>
                    {item.skipReason && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 font-mono">
                          {item.skipReason}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-navy mb-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {item.title}
                    </a>
                  </h2>
                  {item.description && (
                    <p className="text-gray-700 text-sm line-clamp-3">{item.description}</p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
