import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET() {
  try {
    const hasDatabase = Boolean(process.env.DATABASE_URL?.trim())
    if (!hasDatabase) {
      // Fallback or empty if no DB
      return NextResponse.json({ users: [] })
    }

    console.log('GET /api/cms/users - Fetching all users...')
    const users = await ModernCMS.getUsers()
    console.log(`GET /api/cms/users - Successfully fetched ${users.length} users.`)
    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Users API GET error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}
