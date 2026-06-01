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

/**
 * Client-side conversion firing on the thank-you page.
 *
 * Fires:
 *  - GA4 event for the funnel step (lead_magnet_download, waitlist_signup, ...)
 *  - Google Ads conversion if NEXT_PUBLIC_ADS_LABEL_<TYPE> is set
 *
 * Both run after a small delay so the gtag library is reliably initialized
 * — running in useEffect already covers this in 99% of cases.
 */
export default function ThankYouTracking({ type }: { type: string }) {
  useEffect(() => {
    // GA4 event
    if (type === 'waitlist') trackEvent('waitlist_signup', { from: 'danke_page' })
    else if (type === 'lead-magnet') trackEvent('lead_magnet_download', { from: 'danke_page' })
    else if (type === 'newsletter') trackEvent('newsletter_signup', { from: 'danke_page' })
    else if (type === 'contact') trackEvent('contact_form', { from: 'danke_page' })

    // Google Ads conversion (only if label configured)
    const label = ADS_LABEL_BY_TYPE[type]
    if (label) {
      trackAdsConversion(label, { value: VALUE_BY_TYPE[type] ?? 1, currency: 'EUR' })
    }
  }, [type])

  return null
}
