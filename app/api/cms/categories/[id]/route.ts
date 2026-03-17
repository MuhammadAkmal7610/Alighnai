import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedCategory = await ModernCMS.updateCategory(id, body)
    return NextResponse.json({ category: updatedCategory })
  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json({ 
      error: 'Failed to update category',
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
    await ModernCMS.deleteCategory(id)
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete category',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
