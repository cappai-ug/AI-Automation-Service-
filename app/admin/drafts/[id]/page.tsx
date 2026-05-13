'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  publishedAt: string | null
  sourceItem: {
    id: string
    title: string
    link: string
    source: { name: string }
  } | null
}

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-200 text-gray-600',
}

export default function DraftEditPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('ratgeber')
  const [tagsInput, setTagsInput] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated') === 'true'
    if (auth) {
      setAuthenticated(true)
      void load()
    } else {
      setLoading(false)
    }
  }, [])

  function applyDraft(d: Draft) {
    setDraft(d)
    setTitle(d.title)
    setSlug(d.slug)
    setDescription(d.description)
    setCategory(d.category)
    setTagsInput(d.tags.join(', '))
    setContent(d.contentMarkdown)
    setDirty(false)
  }

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/drafts/${id}`)
      if (res.status === 404) {
        setError('Entwurf nicht gefunden.')
        return
      }
      const data = await res.json()
      applyDraft(data)
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

  function markChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setDirty(true)
      setInfo(null)
      setError(null)
    }
  }

  async function patch(payload: Record<string, unknown>): Promise<Draft | null> {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/drafts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Fehler ${res.status}`)
      }
      return await res.json()
    } catch (err: any) {
      setError(err.message || 'Speichern fehlgeschlagen')
      return null
    } finally {
      setSaving(false)
    }
  }

  async function save() {
    const tags = tagsInput
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
    const updated = await patch({
      title,
      slug,
      description,
      category,
      tags,
      contentMarkdown: content,
    })
    if (updated) {
      applyDraft(updated as Draft)
      setInfo('Gespeichert.')
    }
  }

  async function publish() {
    if (dirty) {
      if (!confirm('Es gibt ungespeicherte Änderungen. Trotzdem veröffentlichen?')) return
    }
    if (
      !confirm(
        `"${title}" wirklich veröffentlichen?\n\nDer Artikel erscheint dann unter /blog/${category}/${slug} und ist öffentlich.`
      )
    )
      return
    const tags = tagsInput
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
    const updated = await patch({
      title,
      slug,
      description,
      category,
      tags,
      contentMarkdown: content,
      status: 'published',
    })
    if (updated) {
      applyDraft(updated as Draft)
      setInfo('Veröffentlicht. Erscheint in der Liste unter /blog/' + category + '/' + slug)
    }
  }

  async function unpublish() {
    if (!confirm('Artikel offline nehmen? Er ist dann nicht mehr im Blog sichtbar.')) return
    const updated = await patch({ status: 'draft' })
    if (updated) {
      applyDraft(updated as Draft)
      setInfo('Offline genommen — wieder als Entwurf markiert.')
    }
  }

  async function reject() {
    if (!confirm('Entwurf verwerfen? Wird nicht gelöscht, nur als "rejected" markiert.')) return
    const updated = await patch({ status: 'rejected' })
    if (updated) {
      applyDraft(updated as Draft)
      setInfo('Verworfen.')
    }
  }

  async function destroy() {
    if (!confirm('Entwurf endgültig löschen? Das kann nicht rückgängig gemacht werden.')) return
    const res = await fetch(`/api/admin/drafts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/drafts')
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Löschen fehlgeschlagen')
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Lade…</p>
      </main>
    )
  }

  if (!draft) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">{error || 'Entwurf nicht gefunden.'}</p>
        <Link href="/admin/drafts" className="text-accent hover:underline">
          ← Zurück zur Übersicht
        </Link>
      </main>
    )
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link href="/admin/drafts" className="text-sm text-accent hover:underline">
            ← Zurück zur Liste
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2 py-1 rounded-full font-semibold uppercase ${
                STATUS_STYLE[draft.status] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {draft.status}
            </span>
            <span className="text-gray-500">Relevanz {draft.relevanceScore}/10</span>
            {draft.model && <span className="text-gray-400">· {draft.model}</span>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy mb-1">Entwurf bearbeiten</h1>
        {draft.sourceItem && (
          <p className="text-sm text-gray-500 mb-6">
            Quelle: <span className="font-medium">{draft.sourceItem.source.name}</span> ·{' '}
            <a
              href={draft.sourceItem.link}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              {draft.sourceItem.title}
            </a>
          </p>
        )}

        {(error || info) && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {error || info}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => markChange(setTitle)(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-gray-400 font-mono text-xs">/blog/{category}/{slug || '…'}</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => markChange(setSlug)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => markChange(setCategory)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="ratgeber">Ratgeber</option>
                <option value="branchen">Branchen</option>
                <option value="technologie">Technologie</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung <span className="text-gray-400 text-xs">({description.length}/280)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => markChange(setDescription)(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 text-xs">(komma-getrennt)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => markChange(setTagsInput)(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inhalt (Markdown) <span className="text-gray-400 text-xs">· {wordCount} Wörter</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => markChange(setContent)(e.target.value)}
              rows={28}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="px-5 py-2 bg-navy text-white font-medium rounded-lg disabled:opacity-40"
            >
              {saving ? 'Speichere…' : dirty ? 'Speichern' : 'Gespeichert'}
            </button>

            {draft.status !== 'published' && (
              <button
                onClick={publish}
                disabled={saving}
                className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-40"
              >
                Veröffentlichen
              </button>
            )}

            {draft.status === 'published' && (
              <>
                <Link
                  href={`/blog/${draft.category}/${draft.slug}`}
                  target="_blank"
                  className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Live ansehen
                </Link>
                <button
                  onClick={unpublish}
                  disabled={saving}
                  className="px-5 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-40"
                >
                  Offline nehmen
                </button>
              </>
            )}

            {draft.status !== 'rejected' && draft.status !== 'published' && (
              <button
                onClick={reject}
                disabled={saving}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Verwerfen
              </button>
            )}

            <div className="flex-1" />
            <button
              onClick={destroy}
              className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
            >
              Endgültig löschen
            </button>
          </div>
          {dirty && (
            <p className="text-xs text-yellow-700 mt-3">
              Ungespeicherte Änderungen — vor dem Veröffentlichen erst speichern.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
