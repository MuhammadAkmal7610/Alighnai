import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const take = searchParams.get('take')

    const filters: any = {}
    if (type) filters.type = type
    if (status) filters.status = status
    if (featured === 'true') filters.featured = true
    
    // Convert take to number if present
    const options: any = { ...filters }
    if (take) options.take = parseInt(take)

    const posts = await ModernCMS.getContents(options)

    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Posts API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      details: error.message || 'Unknown error',
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, excerpt, content, category, author, publishedAt, featured, status } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const newPost = await ModernCMS.createContent({
      title,
      slug,
      excerpt,
      content,
      type: body.type || 'BLOG_POST',
      status: status || 'DRAFT',
      featured: featured || false,
      authorId: author, // Mapping author to authorId
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
