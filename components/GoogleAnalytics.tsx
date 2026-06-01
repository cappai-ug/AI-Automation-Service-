'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import {
  CONSENT_EVENT,
  getStoredConsent,
  type ConsentValue,
} from './CookieBanner'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

const ANY_TAG_CONFIGURED = !!GA_ID || !!ADS_ID
// gtag.js is loaded once; whichever ID we have first is used for the script src
const SCRIPT_TAG_ID = GA_ID ?? ADS_ID

/**
 * Loads gtag.js once and configures both GA4 and Google Ads (if their IDs are
 * set). Uses Google Consent Mode v2: defaults are denied, then per-category
 * (analytics_storage for Analytics, ad_storage/ad_user_data/ad_personalization
 * for Marketing) flipped to granted when the user consents in the CookieBanner.
 *
 * Renders nothing if no GA/Ads IDs are configured.
 */
export default function GoogleAnalytics() {
  const [consent, setConsentState] = useState<ConsentValue | null>(null)

  useEffect(() => {
    setConsentState(getStoredConsent())
    function handler(e: Event) {
      const detail = (e as CustomEvent<ConsentValue>).detail
      if (detail && typeof detail === 'object') setConsentState(detail)
    }
    window.addEventListener(CONSENT_EVENT, handler)
    return () => window.removeEventListener(CONSENT_EVENT, handler)
  }, [])

  useEffect(() => {
    if (!ANY_TAG_CONFIGURED) return
    if (typeof window === 'undefined') return
    const w = window as any
    if (typeof w.gtag !== 'function') return
    if (consent == null) return

    w.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    })
  }, [consent])

  if (!ANY_TAG_CONFIGURED) return null

  // The "config" calls must run AFTER gtag.js loads. We push them into
  // dataLayer with the same pattern Google's snippet uses, so they're
  // applied as soon as the library is ready regardless of script order.
  const configCalls = [GA_ID, ADS_ID]
    .filter((id): id is string => !!id)
    .map(
      (id) =>
        `gtag('config', '${id}'${id.startsWith('G-') ? ", { anonymize_ip: true, page_path: window.location.pathname }" : ''});`
    )
    .join('\n          ')

  return (
    <>
      {/* Consent defaults — must run BEFORE gtag.js fires any tag */}
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
        src={`https://www.googletagmanager.com/gtag/js?id=${SCRIPT_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-ads-config" strategy="afterInteractive">
        {`
          ${configCalls}
        `}
      </Script>
    </>
  )
}
