import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | OPTIMAZED - KI Automatisierung',
  description: 'Datenschutzerklärung von OPTIMAZED. Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten.',
  robots: 'index, follow',
}

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
