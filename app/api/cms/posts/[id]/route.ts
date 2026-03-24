import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log(`GET /api/cms/posts/${id} - Fetching post...`)
    const post = await ModernCMS.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    console.log(`GET /api/cms/posts/${id} - Successfully fetched post.`)
    return NextResponse.json({ post })
  } catch (error: any) {
    console.error(`Posts API GET error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch post',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log(`PATCH /api/cms/posts/${id} - Updating post...`)
    const body = await request.json()
    const updatedPost = await ModernCMS.updateContent(id, body)
    console.log(`PATCH /api/cms/posts/${id} - Successfully updated post.`)
    return NextResponse.json({ post: updatedPost })
  } catch (error: any) {
    console.error(`Posts API PATCH error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log(`DELETE /api/cms/posts/${id} - Deleting post...`)
    await ModernCMS.deleteContent(id)
    console.log(`DELETE /api/cms/posts/${id} - Successfully deleted post.`)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    console.error(`Posts API DELETE error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}
