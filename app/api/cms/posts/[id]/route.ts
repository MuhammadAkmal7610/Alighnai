import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedPost = await ModernCMS.updateContent(params.id, body)
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
  { params }: { params: { id: string } }
) {
  try {
    await ModernCMS.deleteContent(params.id)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    console.error('Delete post error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
