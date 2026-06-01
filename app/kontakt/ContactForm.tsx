'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', company: '', useCase: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Senden fehlgeschlagen.')
      router.push('/danke?typ=contact')
    } catch (err: any) {
      setError(err.message || 'Senden fehlgeschlagen.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail-Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => update('email', e.target.value)}
          required
          placeholder="ihre@email.de"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firma / Praxis / Kanzlei <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => update('company', e.target.value)}
          required
          placeholder="Name Ihres Betriebs"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worum geht's? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.useCase}
          onChange={(e) => update('useCase', e.target.value)}
          required
          rows={4}
          placeholder="Kurz: was Sie automatisieren wollen oder welche Frage Sie haben."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent resize-none text-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? 'Wird gesendet…' : 'Nachricht senden'}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Beantwortung Ihrer
        Anfrage verarbeiten dürfen. Details in unserer{' '}
        <a href="/datenschutz" className="text-accent hover:underline">Datenschutzerklärung</a>.
      </p>
    </form>
  )
}
