import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { cmsAuth } from '@/lib/cms-auth'

export async function GET() {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json({ categories: [] })
    }

    const categories = await ModernCMS.getCategories()
    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Categories API GET error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
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
    const { name, slug, description, color, icon } = body

    const newCategory = await ModernCMS.createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      color,
      icon
    })

    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ 
      error: 'Failed to create category',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
