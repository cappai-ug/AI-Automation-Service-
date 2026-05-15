'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, CONSENT_STORAGE_KEY, type ConsentValue } from './CookieBanner'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * GA4 with Google Consent Mode v2.
 *
 * On first render we set consent defaults to "denied" so gtag.js is loaded
 * in cookieless mode (no client identifiers, no remarketing). Once the user
 * clicks "Akzeptieren" in the CookieBanner, the consent state flips to
 * "granted" via gtag('consent', 'update', ...) and full analytics kicks in.
 *
 * If NEXT_PUBLIC_GA_ID is unset, this component renders nothing — handy in
 * local dev or preview environments.
 */
export default function GoogleAnalytics() {
  const [consent, setConsentState] = useState<ConsentValue | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentValue | null
    if (stored === 'accepted' || stored === 'rejected') setConsentState(stored)

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentValue>).detail
      if (detail === 'accepted' || detail === 'rejected') setConsentState(detail)
    }
    window.addEventListener(CONSENT_EVENT, handler)
    return () => window.removeEventListener(CONSENT_EVENT, handler)
  }, [])

  // Whenever consent flips, push the matching consent update to gtag.
  useEffect(() => {
    if (!GA_ID) return
    if (typeof window === 'undefined') return
    // gtag may not be defined yet on first render — wrap defensively.
    const w = window as any
    if (typeof w.gtag !== 'function') return
    if (consent === 'accepted') {
      w.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }
    if (consent === 'rejected') {
      w.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }
  }, [consent])

  if (!GA_ID) return null

  return (
    <>
      {/* Consent defaults — must be set BEFORE gtag.js loads. */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
