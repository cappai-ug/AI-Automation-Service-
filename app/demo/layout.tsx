import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personalisierte Demo | OPTIMAZED - KI Automatisierung',
  description: 'Sehen Sie, wie OPTIMAZED Ihre Geschäftsprozesse mit künstlicher Intelligenz automatisiert. Personalisierte Demo für Ihr Unternehmen.',
  robots: 'noindex, nofollow',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
