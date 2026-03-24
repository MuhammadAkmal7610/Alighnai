import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET() {
  try {
    const hasDatabase = Boolean(process.env.DATABASE_URL?.trim())
    if (!hasDatabase) {
      return NextResponse.json([])
    }

    console.log('GET /api/cms/pages - Fetching pages from DB...')
    const pages = await ModernCMS.getPages()
    console.log(`GET /api/cms/pages - Successfully fetched ${pages.length} pages.`)
    return NextResponse.json(pages)
  } catch (error: any) {
    console.error('Pages API GET error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch pages',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    const newPage = await ModernCMS.createPage(body)
    return NextResponse.json(newPage, { status: 201 })
  } catch (error: any) {
    console.error('Create page error:', error)
    return NextResponse.json({ 
      error: 'Failed to create page',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
