/**
 * Thin wrapper around window.gtag for GA4 event tracking.
 *
 * Safe to call from anywhere: no-ops on server, no-ops when GA isn't loaded
 * (e.g. user rejected the cookie banner). Use this for funnel/conversion
 * events. Standard page_view tracking is handled automatically by gtag.js.
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
  | 'branchen_landing_view' // user landed on a /branchen/<slug> page

export function trackEvent(name: EventName, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag('event', name, params)
  } catch (err) {
    // never throw from tracking — silent fail.
    console.warn('trackEvent failed:', err)
  }
}
