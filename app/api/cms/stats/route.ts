import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { cmsAuth } from '@/lib/cms-auth'

export async function GET() {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json({
        totalContents: 0,
        publishedContents: 0,
        draftContents: 0,
        totalPages: 0,
        publishedPages: 0,
        draftPages: 0,
        totalCategories: 0,
        totalUsers: 0,
      })
    }

    const stats = await ModernCMS.getStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Stats API GET error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch statistics',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}
