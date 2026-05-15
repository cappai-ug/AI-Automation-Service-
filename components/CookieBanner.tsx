'use client'

import { useState, useEffect } from 'react'

export const CONSENT_STORAGE_KEY = 'cappai-cookie-consent'
export const CONSENT_EVENT = 'cookie-consent-changed'

export type ConsentValue = 'accepted' | 'rejected'

function setConsent(value: ConsentValue) {
  localStorage.setItem(CONSENT_STORAGE_KEY, value)
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }))
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const cookieConsent = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    setShowBanner(false)
  }

  const handleReject = () => {
    setConsent('rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm sm:text-base">
            Wir verwenden Cookies, um unsere Website zu verbessern und Ihr Erlebnis zu optimieren.
            Durch die Nutzung dieser Website akzeptieren Sie unsere{' '}
            <a href="/datenschutz" className="underline hover:text-gray-300">Datenschutzrichtlinie</a> und{' '}
            <a href="/cookie-richtlinie" className="underline hover:text-gray-300">Cookie-Richtlinie</a>.
          </p>
        </div>
        <div className="flex gap-3 whitespace-nowrap">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded border border-gray-500 hover:border-gray-300 transition-colors text-sm"
          >
            Ablehnen
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 transition-colors text-sm font-semibold"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
