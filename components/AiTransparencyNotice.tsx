type Props = {
  origin: 'mdx' | 'db'
  aiModel?: string | null
}

/**
 * EU AI Act Art. 50(4) transparency notice. Required disclosure when text
 * is generated or substantially aided by AI and published to inform the
 * public. Rendered prominently on every article page.
 */
export default function AiTransparencyNotice({ origin, aiModel }: Props) {
  // Hand-written MDX articles: no AI involvement, no disclosure required.
  if (origin === 'mdx') return null

  return (
    <aside
      role="note"
      aria-label="Hinweis zur KI-Unterstützung"
      className="my-8 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5 flex gap-3 text-sm"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
          clipRule="evenodd"
        />
      </svg>
      <div className="text-gray-800 leading-relaxed">
        <strong className="text-navy">KI-unterstützter Inhalt.</strong>{' '}
        Dieser Artikel wurde unter Einsatz künstlicher Intelligenz
        {aiModel ? <> (<code className="text-xs bg-white px-1 rounded border border-blue-200">{aiModel}</code>)</> : null}{' '}
        als Entwurf erstellt und vor Veröffentlichung redaktionell geprüft. Die enthaltenen
        Empfehlungen ersetzen keine individuelle Beratung. Weitere Informationen in unserer{' '}
        <a href="/datenschutz" className="text-accent underline hover:text-blue-700">
          Datenschutzerklärung
        </a>
        .
      </div>
    </aside>
  )
}
