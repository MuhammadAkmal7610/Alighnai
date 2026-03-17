import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { InfoType } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    // For Info, we use the 'type' field as the identifier in upsert
    // But we might be passing the database 'id' here.
    // ModernCMS.updateInfo takes InfoType.
    
    // Let's check if the param is a valid InfoType
    if (Object.values(InfoType).includes(id as InfoType)) {
        const updatedInfo = await ModernCMS.updateInfo(id as InfoType, body)
        return NextResponse.json(updatedInfo)
    }
    
    // Fallback: if id is provided but not type, we might need a different method
    // For now, assume param is type or we add a getInfoById if needed.
    return NextResponse.json({ error: 'Invalid info type' }, { status: 400 })
  } catch (error: any) {
    console.error('Update info error:', error)
    return NextResponse.json({ 
      error: 'Failed to update info',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE is not explicitly implemented in ModernCMS for Info, 
// as Info items are usually core site settings (Contact, About, etc.)
// and use upsert. If needed, we can add it later.
