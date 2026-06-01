'use client'

import { useState, useEffect } from 'react'

// Bumped from 'cappai-cookie-consent' (v1) when we switched from a binary
// accept/reject banner to granular analytics/marketing toggles. Legacy
// values are deleted on read so existing visitors are re-prompted —
// otherwise their analytics-only consent would silently keep ad_storage
// denied forever and Google Ads would report "0 % Einwilligungsrate".
export const CONSENT_STORAGE_KEY = 'cappai-cookie-consent-v2'
const LEGACY_KEYS = ['cappai-cookie-consent']
export const CONSENT_EVENT = 'cookie-consent-changed'
export const OPEN_SETTINGS_EVENT = 'cookie-settings-open'

export type ConsentValue = {
  analytics: boolean
  marketing: boolean
}

/**
 * Read the saved consent. Returns null if no v2 value exists — also when
 * a legacy v1 value was present (which we silently clear so the banner
 * re-prompts for marketing consent that v1 never asked about).
 */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  // Migrate away from legacy keys — clear and re-prompt
  for (const legacy of LEGACY_KEYS) {
    if (localStorage.getItem(legacy) != null) {
      localStorage.removeItem(legacy)
    }
  }
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return {
      analytics: !!parsed?.analytics,
      marketing: !!parsed?.marketing,
    }
  } catch {
    return null
  }
}

function persistConsent(value: ConsentValue) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }))
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsChecked, setAnalyticsChecked] = useState(true)
  const [marketingChecked, setMarketingChecked] = useState(true)

  useEffect(() => {
    const existing = getStoredConsent()
    if (existing == null) {
      setShowBanner(true)
    } else {
      // Pre-fill the settings modal with the current choice so re-opens
      // show the user what they previously selected.
      setAnalyticsChecked(existing.analytics)
      setMarketingChecked(existing.marketing)
    }

    // External components (e.g. Footer "Cookie-Einstellungen") can request
    // the settings modal at any time via this custom event.
    function openHandler() {
      const current = getStoredConsent()
      if (current) {
        setAnalyticsChecked(current.analytics)
        setMarketingChecked(current.marketing)
      }
      setShowSettings(true)
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, openHandler)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openHandler)
  }, [])

  function acceptAll() {
    persistConsent({ analytics: true, marketing: true })
    setAnalyticsChecked(true)
    setMarketingChecked(true)
    setShowBanner(false)
    setShowSettings(false)
  }

  function rejectAll() {
    persistConsent({ analytics: false, marketing: false })
    setAnalyticsChecked(false)
    setMarketingChecked(false)
    setShowBanner(false)
    setShowSettings(false)
  }

  function saveSelection() {
    persistConsent({ analytics: analyticsChecked, marketing: marketingChecked })
    setShowBanner(false)
    setShowSettings(false)
  }

  // If neither banner nor settings is visible, nothing to render.
  if (!showBanner && !showSettings) return null

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-2xl border-t border-gray-700">
          <div className="container-max flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 text-sm sm:text-base leading-relaxed">
              <p>
                Wir verwenden Cookies und ähnliche Technologien, um unsere Website zu betreiben (notwendig),
                die Nutzung anonymisiert auszuwerten (Statistik) und Werbung sinnvoll auszuspielen (Marketing).
                Sie entscheiden selbst, was wir verwenden dürfen. Details in unserer{' '}
                <a href="/datenschutz" className="underline hover:text-gray-300">Datenschutzerklärung</a> und{' '}
                <a href="/cookie-richtlinie" className="underline hover:text-gray-300">Cookie-Richtlinie</a>.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 whitespace-nowrap flex-wrap">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 rounded border border-gray-600 hover:border-gray-400 transition-colors text-xs sm:text-sm"
              >
                Einstellungen
              </button>
              <button
                onClick={rejectAll}
                className="px-3 py-2 rounded border border-gray-500 hover:border-gray-300 transition-colors text-xs sm:text-sm"
              >
                Nur notwendige
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded bg-accent hover:bg-blue-600 transition-colors text-xs sm:text-sm font-semibold"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-white text-gray-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">
                Cookie-Einstellungen
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Wählen Sie, welche Cookies wir setzen dürfen. Notwendige Cookies sind immer aktiv,
                weil ohne sie die Seite nicht funktioniert.
              </p>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-not-allowed opacity-90">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <div>
                    <div className="font-semibold text-navy">Notwendig <span className="text-xs text-gray-500 font-normal">(immer aktiv)</span></div>
                    <div className="text-sm text-gray-600">
                      Für Login, Cookie-Wahl und Sicherheit. Ohne diese funktioniert die Seite nicht.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsChecked}
                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-navy">Statistik / Analyse</div>
                    <div className="text-sm text-gray-600">
                      Google Analytics 4 (anonymisierte IP). Hilft uns, die Seite zu verbessern.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingChecked}
                    onChange={(e) => setMarketingChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-navy">Marketing</div>
                    <div className="text-sm text-gray-600">
                      Google Ads Conversion-Tracking. Wir messen, ob unsere Anzeigen sinnvoll sind —
                      ohne Sie persönlich zu identifizieren.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Alle ablehnen
                </button>
                <button
                  onClick={saveSelection}
                  className="px-4 py-2 rounded bg-navy text-white hover:bg-blue-900 text-sm font-semibold"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 rounded bg-accent text-white hover:bg-blue-600 text-sm font-semibold"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
