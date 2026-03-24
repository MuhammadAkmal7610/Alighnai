import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log(`GET /api/cms/categories/${id} - Fetching category...`)
    const category = await ModernCMS.getCategoryById(id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    console.log(`GET /api/cms/categories/${id} - Successfully fetched category.`)
    return NextResponse.json({ category })
  } catch (error: any) {
    console.error(`Categories API GET error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch category',
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
    console.log(`PATCH /api/cms/categories/${id} - Updating category...`)
    const body = await request.json()
    const updatedCategory = await ModernCMS.updateCategory(id, body)
    console.log(`PATCH /api/cms/categories/${id} - Successfully updated category.`)
    return NextResponse.json({ category: updatedCategory })
  } catch (error: any) {
    console.error(`Categories API PATCH error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to update category',
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
    console.log(`DELETE /api/cms/categories/${id} - Deleting category...`)
    await ModernCMS.deleteCategory(id)
    console.log(`DELETE /api/cms/categories/${id} - Successfully deleted category.`)
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error(`Categories API DELETE error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to delete category',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}
