'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type PostMeta = {
  title: string
  description: string
  slug: string
  category: 'ratgeber' | 'branchen' | 'technologie'
  readingMinutes: number
  date: string
  tags: string[]
}

const CATEGORY_LABEL: Record<string, string> = {
  ratgeber: 'Ratgeber',
  branchen: 'Branchen',
  technologie: 'Technologie',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function LatestPostsSection() {
  // null = loading, [] = loaded but empty, [...] = posts
  const [posts, setPosts] = useState<PostMeta[] | null>(null)

  useEffect(() => {
    fetch('/api/blog/latest')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
  }, [])

  // Loaded but no posts: don't render the section at all
  if (posts !== null && posts.length === 0) return null

  return (
    <section id="blog" className="py-32 bg-gradient-to-b from-soft-white to-white">
      <div className="container-max max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">
            Aus unserem Blog
          </div>
          <h2 className="section-heading text-navy">
            Neueste Artikel &amp; Insights
          </h2>
          <p className="section-subheading mt-4 max-w-2xl mx-auto">
            Praxisnahe Tipps zu KI-Automatisierung, DSGVO und Branchen-Anwendungen für deutsche KMU.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts === null
            ? // Loading skeletons
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse"
                >
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-5/6 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-5" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))
            : posts.map((post, i) => (
                <motion.div
                  key={`${post.category}-${post.slug}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/blog/${post.category}/${post.slug}`}
                    className="group block h-full bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-accent transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wide">
                      <span className="text-accent">
                        {CATEGORY_LABEL[post.category] ?? post.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {post.readingMinutes} Min. Lesezeit
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-5 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{formatDate(post.date)}</span>
                      <span className="text-accent font-medium group-hover:underline">
                        Weiterlesen →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-navy hover:bg-blue-900 text-white font-semibold rounded-xl transition-colors"
          >
            Alle Artikel ansehen
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
