'use client'

import { OPEN_SETTINGS_EVENT } from './CookieBanner'

type Props = {
  className?: string
  children?: React.ReactNode
}

/**
 * Dispatches the OPEN_SETTINGS_EVENT custom event so the CookieBanner (mounted
 * once in the root layout) reopens its settings modal. Use anywhere on the
 * site (Footer is the typical spot) so users can revisit their cookie choice.
 */
export default function CookieSettingsLink({
  className,
  children = 'Cookie-Einstellungen',
}: Props) {
  function open() {
    window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))
  }
  return (
    <button
      type="button"
      onClick={open}
      className={className ?? 'text-gray-400 hover:text-white transition-colors text-sm underline-offset-2 hover:underline'}
    >
      {children}
    </button>
  )
}
