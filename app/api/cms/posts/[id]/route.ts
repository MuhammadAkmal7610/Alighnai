import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedPost = await ModernCMS.updateContent(id, body)
    return NextResponse.json({ post: updatedPost })
  } catch (error: any) {
    console.error('Update post error:', error)
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ModernCMS.deleteContent(id)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    console.error('Delete post error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
