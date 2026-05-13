import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { getPrisma } from './prisma'

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
  origin: 'mdx' | 'db'
}

export type Post = PostMeta & {
  content: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// ── MDX-based posts (file system) ───────────────────────────────────────────

function readMdxPost(category: BlogCategory, file: string): Post {
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
    origin: 'mdx',
    content,
  }
}

function loadMdxPosts(): Post[] {
  const out: Post[] = []
  for (const category of Object.keys(CATEGORIES) as BlogCategory[]) {
    const dir = path.join(BLOG_DIR, category)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    for (const file of files) {
      out.push(readMdxPost(category, file))
    }
  }
  return out
}

// ── DB-based published drafts ───────────────────────────────────────────────

async function loadPublishedDrafts(): Promise<Post[]> {
  try {
    const drafts = await getPrisma().blogDraft.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
    })

    return drafts.map((d) => {
      const stats = readingTime(d.contentMarkdown)
      const date = (d.publishedAt ?? d.generatedAt).toISOString().split('T')[0]
      return {
        title: d.title,
        description: d.description,
        date,
        category: d.category as BlogCategory,
        tags: d.tags,
        slug: d.slug,
        readingMinutes: Math.max(1, Math.round(stats.minutes)),
        origin: 'db' as const,
        content: d.contentMarkdown,
      }
    })
  } catch (error) {
    // DB unreachable or table missing (e.g. first deploy before migrations).
    // Don't fail the build — just render MDX-only.
    console.warn('Could not load published drafts from DB:', error)
    return []
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<PostMeta[]> {
  const [mdxPosts, dbPosts] = await Promise.all([
    Promise.resolve(loadMdxPosts()),
    loadPublishedDrafts(),
  ])
  // De-dupe by slug — MDX wins over DB if both exist with the same slug.
  const seenSlugs = new Set(mdxPosts.map((p) => p.slug))
  const merged: Post[] = [
    ...mdxPosts,
    ...dbPosts.filter((p) => !seenSlugs.has(p.slug)),
  ]
  return merged
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta)
}

export async function getPostsByCategory(category: BlogCategory): Promise<PostMeta[]> {
  const all = await getAllPosts()
  return all.filter((p) => p.category === category)
}

export async function getPost(category: BlogCategory, slug: string): Promise<Post | null> {
  // MDX first
  const dir = path.join(BLOG_DIR, category)
  if (fs.existsSync(dir)) {
    const file = fs.readdirSync(dir).find((f) => f.replace(/\.mdx?$/, '') === slug)
    if (file) return readMdxPost(category, file)
  }
  // Then DB
  try {
    const draft = await getPrisma().blogDraft.findFirst({
      where: { status: 'published', slug, category },
    })
    if (!draft) return null
    const stats = readingTime(draft.contentMarkdown)
    const date = (draft.publishedAt ?? draft.generatedAt).toISOString().split('T')[0]
    return {
      title: draft.title,
      description: draft.description,
      date,
      category,
      tags: draft.tags,
      slug: draft.slug,
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
      origin: 'db',
      content: draft.contentMarkdown,
    }
  } catch (error) {
    console.warn('Could not load draft from DB:', error)
    return null
  }
}

export async function getRelatedPosts(current: PostMeta, limit = 3): Promise<PostMeta[]> {
  const all = await getAllPosts()
  const others = all.filter(
    (p) => !(p.slug === current.slug && p.category === current.category)
  )
  const scored = others.map((p) => {
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
