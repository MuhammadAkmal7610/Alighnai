import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedPage = await ModernCMS.updatePage(id, body)
    return NextResponse.json(updatedPage)
  } catch (error: any) {
    console.error('Update page error:', error)
    return NextResponse.json({ 
      error: 'Failed to update page',
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
    await ModernCMS.deletePage(id)
    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error: any) {
    console.error('Delete page error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete page',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
