'use client'

import { useEffect } from 'react'
import { trackAdsConversion, trackEvent } from '@/lib/analytics'

const ADS_LABEL_BY_TYPE: Record<string, string | undefined> = {
  waitlist: process.env.NEXT_PUBLIC_ADS_LABEL_WAITLIST,
  'lead-magnet': process.env.NEXT_PUBLIC_ADS_LABEL_LEAD_MAGNET,
  newsletter: process.env.NEXT_PUBLIC_ADS_LABEL_NEWSLETTER,
  contact: process.env.NEXT_PUBLIC_ADS_LABEL_CONTACT,
}

const VALUE_BY_TYPE: Record<string, number> = {
  waitlist: 50,
  'lead-magnet': 5,
  newsletter: 5,
  contact: 30,
}

const GA_EVENT_BY_TYPE: Record<
  string,
  'waitlist_signup' | 'lead_magnet_download' | 'newsletter_signup' | 'contact_form' | undefined
> = {
  waitlist: 'waitlist_signup',
  'lead-magnet': 'lead_magnet_download',
  newsletter: 'newsletter_signup',
  contact: 'contact_form',
}

/**
 * Client-side conversion firing on the thank-you page.
 *
 * Fires:
 *  - GA4 event for the funnel step (lead_magnet_download, waitlist_signup, ...)
 *  - Google Ads conversion if NEXT_PUBLIC_ADS_LABEL_<TYPE> is set
 *
 * If gtag.js hasn't loaded yet at mount time (very rare — useEffect runs after
 * the afterInteractive script, but adblockers / slow networks can delay it),
 * we poll for it briefly before giving up.
 */
export default function ThankYouTracking({ type }: { type: string }) {
  useEffect(() => {
    const eventName = GA_EVENT_BY_TYPE[type]
    const adsLabel = ADS_LABEL_BY_TYPE[type]
    const value = VALUE_BY_TYPE[type] ?? 1

    function fire() {
      if (typeof window === 'undefined') return false
      const w = window as any
      if (typeof w.gtag !== 'function') return false

      if (eventName) {
        trackEvent(eventName, { from: 'danke_page', value })
        console.info(`[conversion] GA4 event fired: ${eventName} (typ=${type})`)
      }

      if (adsLabel) {
        trackAdsConversion(adsLabel, { value, currency: 'EUR' })
        console.info(
          `[conversion] Google Ads conversion fired: AW/${adsLabel} value=${value} EUR (typ=${type})`
        )
      } else {
        console.info(
          `[conversion] No ads label configured for typ="${type}" — set NEXT_PUBLIC_ADS_LABEL_<TYPE> in Vercel.`
        )
      }
      return true
    }

    // Try immediately; if gtag isn't ready, poll for up to 3 s (15 × 200 ms).
    if (fire()) return
    let attempts = 0
    const timer = setInterval(() => {
      attempts += 1
      if (fire() || attempts >= 15) clearInterval(timer)
    }, 200)
    return () => clearInterval(timer)
  }, [type])

  return null
}
