'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

type Props = {
  /** Optional override for the Calendly URL; defaults to NEXT_PUBLIC_CALENDLY_URL. */
  url?: string
  /** Button label */
  label?: string
  /** Source identifier used in the GA event params */
  source?: string
  /** Additional Tailwind classes */
  className?: string
}

const DEFAULT_URL = process.env.NEXT_PUBLIC_CALENDLY_URL
const SCRIPT_URL = 'https://assets.calendly.com/assets/external/widget.js'
const CSS_URL = 'https://assets.calendly.com/assets/external/widget.css'

/**
 * Strategy-call CTA button.
 *
 * Behavior depends on configuration:
 *   • NEXT_PUBLIC_CALENDLY_URL set → loads Calendly's popup widget on first
 *     click, fires `strategy_call_opened` on click and
 *     `strategy_call_scheduled` when Calendly posts the success message.
 *   • Not set → renders a `mailto:hello@optimazed.de` fallback so the page
 *     still has a usable CTA.
 *
 * The Calendly script + CSS are injected lazily on first click — zero cost
 * for visitors who never engage.
 */
export default function CalendlyButton({
  url,
  label = 'Strategiegespräch buchen',
  source = 'unknown',
  className,
}: Props) {
  const calendlyUrl = url ?? DEFAULT_URL
  const [loaded, setLoaded] = useState(false)
  const baseClass =
    className ??
    'inline-flex items-center justify-center px-7 py-3 bg-accent hover:bg-blue-600 text-white font-semibold rounded-xl text-lg transition-colors'

  useEffect(() => {
    if (!calendlyUrl) return
    // Listen for Calendly's "event_scheduled" postMessage to fire a conversion.
    function handleMessage(e: MessageEvent) {
      const data = e.data
      if (
        data &&
        typeof data === 'object' &&
        data.event === 'calendly.event_scheduled'
      ) {
        trackEvent('strategy_call_scheduled', { source })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [calendlyUrl, source])

  if (!calendlyUrl) {
    // Fallback: mailto, so the page still has a working CTA before Calendly
    // is set up in env.
    return (
      <a
        href={`mailto:hello@optimazed.de?subject=Strategiegespr%C3%A4ch%20%E2%80%94%20${encodeURIComponent(source)}&body=Hallo%2C%0A%0Aich%20m%C3%B6chte%20ein%20kostenloses%2030-Min-Strategiegespr%C3%A4ch%20vereinbaren.%0A%0AMein%20Engpass%2FInteresse%3A%0A%0A%0AVielen%20Dank`}
        className={baseClass}
        onClick={() => trackEvent('strategy_call_opened', { source, fallback: 'mailto' })}
      >
        {label}
      </a>
    )
  }

  function injectCalendly() {
    if (loaded) return
    if (typeof document === 'undefined') return

    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }

    if (!document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => setLoaded(true)
      document.body.appendChild(script)
    } else {
      setLoaded(true)
    }
  }

  function open(e: React.MouseEvent) {
    e.preventDefault()
    trackEvent('strategy_call_opened', { source })
    injectCalendly()
    // Calendly may need a tick after injection on the very first click.
    const tryOpen = (attempts = 10) => {
      const w = window as any
      if (w.Calendly?.initPopupWidget) {
        w.Calendly.initPopupWidget({ url: calendlyUrl })
      } else if (attempts > 0) {
        setTimeout(() => tryOpen(attempts - 1), 200)
      }
    }
    tryOpen()
  }

  return (
    <button onClick={open} className={baseClass}>
      {label}
    </button>
  )
}
