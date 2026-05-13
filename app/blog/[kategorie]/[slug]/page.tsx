import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CATEGORIES,
  getAllPosts,
  getPost,
  getRelatedPosts,
  formatDate,
  isValidCategory,
} from '@/lib/blog'

type Props = { params: { kategorie: string; slug: string } }

export const revalidate = 60
// Allow DB-published drafts whose slugs weren't known at build time.
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ kategorie: p.category, slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isValidCategory(params.kategorie)) return {}
  const post = await getPost(params.kategorie, params.slug)
  if (!post) return {}

  const url = `https://www.optimazed.de/blog/${post.category}/${post.slug}`
  return {
    title: `${post.title} | OPTIMAZED Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      siteName: 'OPTIMAZED',
      locale: 'de_DE',
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  }
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl sm:text-4xl font-bold text-navy mt-12 mb-6" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-10 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl sm:text-2xl font-bold text-navy mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 leading-relaxed mb-5" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-outside ml-6 space-y-2 mb-5 text-gray-700" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside ml-6 space-y-2 mb-5 text-gray-700" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent underline hover:text-blue-700" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-navy" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-gray-700 my-6"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 text-navy px-1.5 py-0.5 rounded text-sm" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto">
      <table
        className="w-full text-sm text-left border-collapse rounded-lg overflow-hidden shadow-sm"
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-navy text-white" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-gray-200 bg-white" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-soft-white" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-left" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-gray-700 align-top" {...props} />
  ),
  hr: () => <hr className="my-10 border-gray-200" />,
}

export default async function ArticlePage({ params }: Props) {
  if (!isValidCategory(params.kategorie)) notFound()
  const post = await getPost(params.kategorie, params.slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post)
  const url = `https://www.optimazed.de/blog/${post.category}/${post.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'OPTIMAZED' },
    publisher: {
      '@type': 'Organization',
      name: 'OPTIMAZED',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.optimazed.de/images/logo.svg',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: post.image ? `https://www.optimazed.de${post.image}` : undefined,
    keywords: post.tags.join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://www.optimazed.de/blog' },
      {
        '@type': 'ListItem',
        position: 2,
        name: CATEGORIES[post.category].label,
        item: `https://www.optimazed.de/blog/${post.category}`,
      },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <main className="bg-white">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="pt-32 pb-20">
        <div className="container-max max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8 flex flex-wrap gap-2 items-center">
            <Link href="/blog" className="hover:text-navy">
              Blog
            </Link>
            <span>/</span>
            <Link href={`/blog/${post.category}`} className="hover:text-navy">
              {CATEGORIES[post.category].label}
            </Link>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wide">
              <span className="text-accent">{CATEGORIES[post.category].label}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{post.readingMinutes} Min. Lesezeit</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{formatDate(post.date)}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">{post.description}</p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-3 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose-content">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'append',
                        properties: {
                          className: 'heading-anchor',
                          ariaLabel: 'Direkt-Link zur Sektion',
                        },
                        content: { type: 'text', value: '#' },
                      },
                    ],
                    [
                      rehypeExternalLinks,
                      { target: '_blank', rel: ['noopener', 'noreferrer'] },
                    ],
                  ],
                },
              }}
            />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-20 bg-soft-white border-t border-gray-100">
          <div className="container-max max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-10 text-center">
              Verwandte Artikel
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={`${r.category}-${r.slug}`}
                  href={`/blog/${r.category}/${r.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
                    {CATEGORIES[r.category].label} • {r.readingMinutes} Min.
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-accent transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
