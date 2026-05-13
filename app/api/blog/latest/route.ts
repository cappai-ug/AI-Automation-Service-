import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export const revalidate = 60

export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts.slice(0, 3))
  } catch (error) {
    console.error('Failed to load latest posts:', error)
    return NextResponse.json([], { status: 200 })
  }
}
