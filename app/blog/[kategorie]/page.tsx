import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CATEGORIES,
  getPostsByCategory,
  formatDate,
  isValidCategory,
  type BlogCategory,
} from '@/lib/blog'

type Props = { params: { kategorie: string } }

export const revalidate = 60

export function generateStaticParams() {
  return (Object.keys(CATEGORIES) as BlogCategory[]).map((kategorie) => ({ kategorie }))
}

export function generateMetadata({ params }: Props): Metadata {
  if (!isValidCategory(params.kategorie)) return {}
  const cat = CATEGORIES[params.kategorie]
  const url = `https://www.optimazed.de/blog/${params.kategorie}`
  return {
    title: `${cat.label} – Blog | OPTIMAZED`,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.label} – Blog | OPTIMAZED`,
      description: cat.description,
      type: 'website',
      url,
      siteName: 'OPTIMAZED',
      locale: 'de_DE',
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  if (!isValidCategory(params.kategorie)) notFound()
  const category = params.kategorie
  const cat = CATEGORIES[category]
  const posts = await getPostsByCategory(category)

  return (
    <main className="bg-white">
      <Header />

      <section className="bg-gradient-to-br from-navy via-blue-950 to-navy text-white pt-32 pb-20">
        <div className="container-max max-w-5xl text-center">
          <div className="text-sm uppercase tracking-widest text-secondary mb-4">Kategorie</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">{cat.label}</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">{cat.description}</p>
        </div>
      </section>

      <section className="py-16 border-b border-gray-100">
        <div className="container-max max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/blog"
              className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-navy font-medium text-sm transition-colors"
            >
              Alle Beiträge
            </Link>
            {(Object.entries(CATEGORIES) as [BlogCategory, (typeof CATEGORIES)[BlogCategory]][]).map(
              ([slug, c]) => (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                    slug === category
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-navy'
                  }`}
                >
                  {c.label}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max max-w-5xl">
          {posts.length === 0 ? (
            <p className="text-center text-gray-600">Bald gibt es hier neue Beiträge.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
