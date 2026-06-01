'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WaitlistForm({ variant = 'default' }: { variant?: 'default' | 'modal' }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    useCase: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'exists'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.status === 'already_exists') {
          setStatus('exists')
          setMessage('Sie sind bereits registriert. Wir melden uns in Kürze bei Ihnen.')
        } else {
          // Forward to the /danke page so the conversion is firing on a
          // standalone URL — gives Google Ads a clean conversion event.
          router.push('/danke?typ=waitlist')
          return
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 sm:space-y-4 w-full mx-auto ${variant === 'modal' ? 'max-w-md' : 'max-w-2xl'}`}>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Ihre E-Mail-Adresse"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
        />
      </div>

      <div>
        <input
          type="text"
          name="company"
          placeholder="Praxis/Kanzlei/Agentur-Name"
          required
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
        />
      </div>

      <div>
        <textarea
          name="useCase"
          placeholder="Was ist Ihr größtes Problem? (z.B. 'Verpasste Anrufe', 'Email-Chaos', 'Zu viele Leads verloren')"
          required
          rows={3}
          value={formData.useCase}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm sm:text-base"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? 'Wird versendet...' : 'Kostenlose Demo anfordern'}
      </button>

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {message} Wir schreiben Ihnen noch heute eine E-Mail mit Ihrem Demo-Link!
        </div>
      )}

      {status === 'exists' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          ℹ️ {message}
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {message}
        </div>
      )}

      <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
        Wir respektieren Ihre Privatsphäre. Lesen Sie unsere{' '}
        <a href="/datenschutz" className="text-accent hover:underline font-semibold">Datenschutzerklärung</a>.
      </p>
    </form>
  )
}
