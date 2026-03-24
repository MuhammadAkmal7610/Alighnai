import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log(`GET /api/cms/pages/${id} - Fetching page...`)
    const page = await ModernCMS.getPageById(id)
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    console.log(`GET /api/cms/pages/${id} - Successfully fetched page.`)
    return NextResponse.json(page)
  } catch (error: any) {
    console.error(`Pages API GET error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to fetch page',
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
    console.log(`PATCH /api/cms/pages/${id} - Updating page...`)
    let body;
    try {
      const text = await request.text();
      if (!text) {
        return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
      }
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const updatedPage = await ModernCMS.updatePage(id, body)
    console.log(`PATCH /api/cms/pages/${id} - Successfully updated page.`)
    return NextResponse.json(updatedPage)
  } catch (error: any) {
    console.error(`Pages API PATCH error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to update page',
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
    console.log(`DELETE /api/cms/pages/${id} - Deleting page...`)
    await ModernCMS.deletePage(id)
    console.log(`DELETE /api/cms/pages/${id} - Successfully deleted page.`)
    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error: any) {
    console.error(`Pages API DELETE error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to delete page',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}
