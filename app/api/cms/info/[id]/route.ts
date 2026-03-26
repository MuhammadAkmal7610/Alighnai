import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { InfoType, type InfoType as InfoTypeValue } from '@/lib/cms-enums'
import { cmsAuth } from '@/lib/cms-auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

  const { id } = await params
  try {
    console.log(`PATCH /api/cms/info/${id} - Updating info item...`)
    const body = await request.json()
    // For Info, we use the 'type' field as the identifier in upsert
    // But we might be passing the database 'id' here.
    // ModernCMS.updateInfo takes InfoType.
    
    // Let's check if the param is a valid InfoType
    if (Object.values(InfoType).includes(id as InfoTypeValue)) {
        const updatedInfo = await ModernCMS.updateInfo(id as InfoTypeValue, body)
        console.log(`PATCH /api/cms/info/${id} - Successfully updated info item.`)
        return NextResponse.json(updatedInfo)
    }
    
    console.warn(`PATCH /api/cms/info/${id} - Invalid info type provided.`)
    // Fallback: if id is provided but not type, we might need a different method
    // For now, assume param is type or we add a getInfoById if needed.
    return NextResponse.json({ error: 'Invalid info type' }, { status: 400 })
  } catch (error: any) {
    console.error(`Info API PATCH error (id: ${id}):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: 'Failed to update info',
      details: error.message || 'Unknown error',
      code: error.code
    }, { status: 500 })
  }
}

// DELETE is not explicitly implemented in ModernCMS for Info, 
// as Info items are usually core site settings (Contact, About, etc.)
// and use upsert. If needed, we can add it later.
