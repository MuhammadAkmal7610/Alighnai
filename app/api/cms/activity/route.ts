import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') || '5')

    console.log(`GET /api/cms/activity - Fetching ${take} recent activities...`)
    const activity = await ModernCMS.getRecentActivity(take)
    console.log(`GET /api/cms/activity - Successfully fetched ${activity.length} activities.`)

    return NextResponse.json({ activity })
  } catch (error: any) {
    console.error('Activity API GET error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch recent activity',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
