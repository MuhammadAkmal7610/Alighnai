import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { cmsAuth, resolveSessionAuthorId } from '@/lib/cms-auth'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(request: Request) {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json({ posts: [] })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const take = searchParams.get('take')

    const filters: Record<string, unknown> = {}
    if (type) filters.type = type
    if (status) filters.status = status
    if (featured === 'true') filters.featured = true

    const options: Record<string, unknown> = { ...filters }
    if (take) options.take = parseInt(take, 10)

    const posts = await ModernCMS.getContents(options as any)
    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Posts API GET error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      details: error.message || 'Unknown error',
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

  try {
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      type,
      status,
      featured,
      categoryId,
      slug: bodySlug,
      metadata,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug =
      typeof bodySlug === 'string' && bodySlug.trim()
        ? slugify(bodySlug.trim())
        : slugify(String(title))

    const authorId = await resolveSessionAuthorId(authResult.session)

    const newPost = await ModernCMS.createContent({
      title,
      slug,
      excerpt,
      content,
      type: type || 'BLOG_POST',
      status: status || 'DRAFT',
      featured: Boolean(featured),
      categoryId:
        typeof categoryId === 'string' && categoryId.trim()
          ? categoryId.trim()
          : undefined,
      authorId,
      metadata:
        metadata && typeof metadata === 'object' && !Array.isArray(metadata)
          ? metadata
          : undefined,
    })

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json({ 
      error: 'Failed to create post',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
