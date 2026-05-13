import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CATEGORIES, getAllPosts, formatDate, type BlogCategory } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog – KI-Automatisierung, DSGVO & Branchen-Insights | OPTIMAZED',
  description:
    'Praxisnahe Artikel zu KI-Automatisierung im Mittelstand: Ratgeber, Branchen-Anwendungsfälle und Technologie-Hintergründe. Jetzt lesen.',
  alternates: { canonical: 'https://www.optimazed.de/blog' },
  openGraph: {
    title: 'Blog – KI-Automatisierung & Branchen-Insights | OPTIMAZED',
    description: 'Ratgeber, Branchen-Insights und Technologie-Hintergründe zu KI-Automatisierung.',
    type: 'website',
    url: 'https://www.optimazed.de/blog',
    siteName: 'OPTIMAZED',
    locale: 'de_DE',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const categories = Object.entries(CATEGORIES) as [BlogCategory, (typeof CATEGORIES)[BlogCategory]][]

  return (
    <main className="bg-white">
      <Header />

      <section className="bg-gradient-to-br from-navy via-blue-950 to-navy text-white pt-32 pb-20">
        <div className="container-max max-w-5xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Blog &amp; Ratgeber</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            Praxisnahe Artikel zu KI-Automatisierung, DSGVO und Branchenanwendungen für den deutschen Mittelstand.
          </p>
        </div>
      </section>

      <section className="py-16 border-b border-gray-100">
        <div className="container-max max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/blog"
              className="px-5 py-2 rounded-full bg-navy text-white font-medium text-sm"
            >
              Alle Beiträge
            </Link>
            {categories.map(([slug, cat]) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-navy font-medium text-sm transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={`${post.category}-${post.slug}`}
                href={`/blog/${post.category}/${post.slug}`}
                className="group block bg-soft-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wide text-accent">
                  <span>{CATEGORIES[post.category].label}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{post.readingMinutes} Min. Lesezeit</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>
                <div className="text-sm text-gray-500">{formatDate(post.date)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
