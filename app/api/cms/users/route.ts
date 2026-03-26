import { NextResponse } from 'next/server'
import { ModernCMS } from '@/lib/modern-cms'
import { cmsAuth, cmsAuthAdmin } from '@/lib/cms-auth'
import { UserRole } from '@/lib/cms-enums'
import type { UserRole as UserRoleT } from '@/lib/cms-enums'

const ROLES = new Set<string>(Object.values(UserRole))

export async function GET() {
  const authResult = await cmsAuth()
  if (!authResult.ok) return authResult.response

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

export async function POST(request: Request) {
  const authResult = await cmsAuthAdmin()
  if (!authResult.ok) return authResult.response

  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const roleRaw = typeof body.role === 'string' ? body.role : ''
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    if (!ROLES.has(roleRaw)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const user = await ModernCMS.createUser({
      email,
      name: name || email.split('@')[0] || 'User',
      password,
      role: roleRaw as UserRoleT,
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (error: unknown) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : ''
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }
    const msg = error instanceof Error ? error.message : 'Create failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
