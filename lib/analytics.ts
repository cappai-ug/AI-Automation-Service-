/**
 * Thin wrapper around window.gtag for GA4 + Google Ads tracking.
 *
 * Safe to call from anywhere: no-ops on server, no-ops when gtag isn't loaded
 * (e.g. user rejected the cookie banner). Standard page_view tracking is
 * handled automatically by gtag.js.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

type EventName =
  | 'lead_magnet_download' // user submitted the newsletter form with a lead-magnet source
  | 'newsletter_signup' // user submitted the standalone newsletter form
  | 'strategy_call_opened' // user clicked the "Strategiegespräch buchen" button (Calendly opened)
  | 'strategy_call_scheduled' // Calendly confirmed a booking
  | 'waitlist_signup' // user submitted the landing-page waitlist
  | 'contact_form' // user submitted the /kontakt page form
  | 'branchen_landing_view' // user landed on a /branchen/<slug> page

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

export function trackEvent(name: EventName, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag('event', name, params)
  } catch (err) {
    console.warn('trackEvent failed:', err)
  }
}

/**
 * Fire a Google Ads conversion. The `label` is the per-conversion-action
 * identifier from the Google Ads UI (Tools → Conversions → ... → Tag-Setup).
 * Example label: "AbC-D_efG-h12_34-567"
 *
 * Once Google Ads conversion actions are configured, store the labels in
 * env vars (e.g. NEXT_PUBLIC_ADS_LABEL_STRATEGY_CALL) and call this helper
 * from the relevant form on success.
 */
export function trackAdsConversion(
  label: string,
  params: { value?: number; currency?: string; transactionId?: string } = {}
): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  if (!ADS_ID) return
  try {
    window.gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${label}`,
      value: params.value,
      currency: params.currency ?? 'EUR',
      transaction_id: params.transactionId,
    })
  } catch (err) {
    console.warn('trackAdsConversion failed:', err)
  }
}
