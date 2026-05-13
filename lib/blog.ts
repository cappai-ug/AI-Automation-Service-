import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export type BlogCategory = 'ratgeber' | 'branchen' | 'technologie'

export const CATEGORIES: Record<BlogCategory, { label: string; description: string }> = {
  ratgeber: {
    label: 'Ratgeber',
    description: 'Praxisnahe Tipps rund um KI-Automatisierung im Mittelstand.',
  },
  branchen: {
    label: 'Branchen',
    description: 'Konkrete Anwendungsfälle für Praxen, Kanzleien, Agenturen und Handwerk.',
  },
  technologie: {
    label: 'Technologie',
    description: 'Hintergründe zu KI, DSGVO und Tech-Trends für Entscheider.',
  },
}

export type PostFrontmatter = {
  title: string
  description: string
  date: string
  category: BlogCategory
  tags: string[]
  image?: string
}

export type PostMeta = PostFrontmatter & {
  slug: string
  readingMinutes: number
}

export type Post = PostMeta & {
  content: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function readPost(category: BlogCategory, file: string): Post {
  const filePath = path.join(BLOG_DIR, category, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const slug = file.replace(/\.mdx?$/, '')
  const stats = readingTime(content)

  return {
    ...(data as PostFrontmatter),
    category,
    slug,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  const categories = Object.keys(CATEGORIES) as BlogCategory[]
  const posts: Post[] = []

  for (const category of categories) {
    const dir = path.join(BLOG_DIR, category)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    for (const file of files) {
      posts.push(readPost(category, file))
    }
  }

  return posts
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta)
}

export function getPostsByCategory(category: BlogCategory): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPost(category: BlogCategory, slug: string): Post | null {
  const dir = path.join(BLOG_DIR, category)
  if (!fs.existsSync(dir)) return null
  const file = fs.readdirSync(dir).find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return null
  return readPost(category, file)
}

export function getRelatedPosts(current: PostMeta, limit = 3): PostMeta[] {
  const all = getAllPosts().filter((p) => !(p.slug === current.slug && p.category === current.category))
  const scored = all.map((p) => {
    let score = 0
    if (p.category === current.category) score += 3
    const shared = p.tags.filter((t) => current.tags.includes(t)).length
    score += shared
    return { post: p, score }
  })
  scored.sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
  return scored.slice(0, limit).map((s) => s.post)
}

export function isValidCategory(value: string): value is BlogCategory {
  return value in CATEGORIES
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}
