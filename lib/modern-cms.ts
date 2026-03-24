import { prisma } from './prisma'
import { ContentType, ContentStatus, UserRole, InfoType } from '@/lib/cms-enums'

function isDatabaseConfigError(error: unknown): boolean {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code || '')
    : ''

  // Prisma known errors that indicate missing/unreachable database infrastructure.
  if (['P1001', 'P1002', 'P1003', 'P1017', 'P2021', 'P2022'].includes(code)) {
    return true
  }

  if (!(error instanceof Error)) return false
  return (
    error.message.includes('DATABASE_URL is not set') ||
    error.message.includes('DATABASE_URL is not a valid URL') ||
    error.message.includes('DATABASE_URL must use a postgres:// or postgresql:// scheme') ||
    error.message.includes('does not exist on the database server')
  )
}

// Types for the modern CMS
export interface CreateContentData {
  title: string
  slug: string
  excerpt?: string
  content: string
  type: ContentType
  status?: ContentStatus
  featured?: boolean
  publishedAt?: Date
  categoryId?: string
  authorId?: string
  metadata?: any
}

export interface UpdateContentData extends Partial<CreateContentData> {
  id: string
}

export interface CreatePageData {
  title: string
  slug: string
  content: string
  status?: ContentStatus
  template?: string
  metadata?: any
  authorId?: string
}

export interface CreateInfoData {
  type: InfoType
  title: string
  content: string
  metadata?: any
  isPublic?: boolean
}

// Modern CMS Database Service
export class ModernCMS {
  // Content Management (Blog/Articles)
  static async getContents(options?: {
    type?: ContentType
    status?: ContentStatus
    featured?: boolean
    categoryId?: string
    authorId?: string
    take?: number
    skip?: number
  }) {
    const { take, skip, ...filters } = options || {}
    
    try {
      return await prisma.content.findMany({
        where: filters,
        take,
        skip,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: true
        },
        orderBy: { publishedAt: 'desc' }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return []
      throw error
    }
  }

  static async getContentBySlug(slug: string) {
    try {
      return await prisma.content.findUnique({
        where: { slug },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: true
        }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return null
      throw error
    }
  }

  static async createContent(data: CreateContentData) {
    return await prisma.content.create({
      data: {
        ...data,
        publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null
      },
      include: {
        author: true,
        category: true
      }
    })
  }

  static async updateContent(id: string, data: any) {
    // Remove relation objects and non-updatable fields
    const { id: _id, author, category, createdAt, updatedAt, ...cleanData } = data
    
    return await prisma.content.update({
      where: { id },
      data: {
        ...cleanData,
        publishedAt: data.status === ContentStatus.PUBLISHED && !data.publishedAt ? new Date() : data.publishedAt
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: true
      }
    })
  }

  static async deleteContent(id: string) {
    return await prisma.content.delete({
      where: { id }
    })
  }

  static async getPostById(id: string) {
    try {
      return await prisma.content.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: true
        }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return null
      throw error
    }
  }

  // Categories
  static async getCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { contents: true }
        }
      }
    })
  }

  static async createCategory(data: { name: string; slug: string; description?: string; color?: string; icon?: string }) {
    return await prisma.category.create({
      data
    })
  }

  static async updateCategory(id: string, data: Partial<{ name: string; description: string; color: string; icon: string }>) {
    return await prisma.category.update({
      where: { id },
      data
    })
  }

  static async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id }
    })
  }

  static async getCategoryById(id: string) {
    try {
      return await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { contents: true }
          }
        }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return null
      throw error
    }
  }

  // Pages Management (Home, About, Framework, etc.)
  static async getPages(options?: { status?: ContentStatus; template?: string; take?: number; skip?: number }) {
    const { take, skip, ...filters } = options || {}
    
    try {
      return await prisma.page.findMany({
        where: filters,
        take,
        skip,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return []
      throw error
    }
  }

  static async getPageBySlug(slug: string) {
    try {
      return await prisma.page.findUnique({
        where: { slug },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return null
      throw error
    }
  }

  static async getPageById(id: string) {
    try {
      if (!id) throw new Error('getPageById: ID is required');
      console.log(`CMS Backend: query.page.findUnique(id: ${id})`);
      const page = await prisma.page.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      if (page) console.log(`CMS Backend: successfully retrieved page "${page.title}" (slug: ${page.slug})`);
      else console.log(`CMS Backend: page not found (id: ${id})`);
      return page;
    } catch (error: any) {
      console.error(`CMS Backend Error: getPageById(${id}):`, error.message);
      if (isDatabaseConfigError(error)) return null;
      throw error;
    }
  }

  static async createPage(data: CreatePageData) {
    return await prisma.page.create({
      data,
      include: {
        author: true
      }
    })
  }

  static async updatePage(id: string, data: any) {
    try {
      if (!id) throw new Error('updatePage: ID is required');
      console.log(`CMS Backend: request to updatePage(id: ${id})`);
      
      // Ensure metadata is an object if it exists
      if (data.metadata && typeof data.metadata === 'string') {
        try {
          data.metadata = JSON.parse(data.metadata);
        } catch (e) {
          console.error('CMS Backend: Failed to parse metadata string', e);
        }
      }

      // Remove relation objects and non-updatable fields
      const { id: _id, author, createdAt, updatedAt, ...updateData } = data
      
      const updated = await prisma.page.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      console.log(`CMS Backend: successfully updated page "${updated.title}"`);
      return updated;
    } catch (error: any) {
      console.error(`CMS Backend Error: updatePage(${id}):`, error.message);
      throw error;
    }
  }

  static async deletePage(id: string) {
    return await prisma.page.delete({
      where: { id }
    })
  }

  // Info Management (Contact, About, Social, Legal, Settings)
  static async getInfo(type: InfoType) {
    try {
      return await prisma.info.findUnique({
        where: { type }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return null
      throw error
    }
  }

  static async getAllInfo() {
    try {
      return await prisma.info.findMany({
        where: { isPublic: true }
      })
    } catch (error) {
      if (isDatabaseConfigError(error)) return []
      throw error
    }
  }

  static async createInfo(data: CreateInfoData) {
    return await prisma.info.create({
      data
    })
  }

  static async updateInfo(type: InfoType, data: Partial<CreateInfoData>) {
    return await prisma.info.upsert({
      where: { type },
      update: data,
      create: {
        type,
        title: data.title || '',
        content: data.content || '',
        ...data
      } as any
    })
  }

  // Users
  static async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            contents: true,
            pages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        lastLoginAt: true,
        createdAt: true
      }
    })
  }

  static async updateUser(id: string, data: Partial<{ name: string; avatar: string; bio: string; role: UserRole }>) {
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  // Statistics
  static async getStats() {
    try {
      const [
        totalContents,
        publishedContents,
        totalPages,
        publishedPages,
        totalCategories,
        totalUsers
      ] = await Promise.all([
        prisma.content.count(),
        prisma.content.count({ where: { status: ContentStatus.PUBLISHED } }),
        prisma.page.count(),
        prisma.page.count({ where: { status: ContentStatus.PUBLISHED } }),
        prisma.category.count(),
        prisma.user.count()
      ])

      return {
        totalContents,
        publishedContents,
        draftContents: totalContents - publishedContents,
        totalPages,
        publishedPages,
        draftPages: totalPages - publishedPages,
        totalCategories,
        totalUsers
      }
    } catch (error) {
      if (isDatabaseConfigError(error)) {
        return {
          totalContents: 0,
          publishedContents: 0,
          draftContents: 0,
          totalPages: 0,
          publishedPages: 0,
          draftPages: 0,
          totalCategories: 0,
          totalUsers: 0
        }
      }
      throw error
    }
  }

  static async getRecentActivity(take: number = 5) {
    try {
      const [contents, pages] = await Promise.all([
        prisma.content.findMany({
          take,
          include: {
            author: { select: { id: true, name: true } }
          },
          orderBy: { updatedAt: 'desc' }
        }),
        prisma.page.findMany({
          take,
          include: {
            author: { select: { id: true, name: true } }
          },
          orderBy: { updatedAt: 'desc' }
        })
      ])

      const activity = [
        ...contents.map(c => ({ ...c, type: 'POST' })),
        ...pages.map(p => ({ ...p, type: 'PAGE' }))
      ]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, take)

      return activity
    } catch (error) {
      if (isDatabaseConfigError(error)) return []
      throw error
    }
  }

  // Search
  static async search(query: string, type?: 'content' | 'page' | 'all') {
    const searchQuery = {
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { content: { contains: query, mode: 'insensitive' as const } },
          { excerpt: { contains: query, mode: 'insensitive' as const } }
        ] as any
      }
    };

    if (type === 'content') {
      return await prisma.content.findMany({
        ...searchQuery,
        include: {
          author: { select: { id: true, name: true } },
          category: true
        }
      })
    }

    if (type === 'page') {
      return await prisma.page.findMany({
        ...searchQuery,
        include: {
          author: { select: { id: true, name: true } }
        }
      })
    }

    // Search all
    const [contents, pages] = await Promise.all([
      prisma.content.findMany({
        ...searchQuery,
        include: {
          author: { select: { id: true, name: true } },
          category: true
        }
      }),
      prisma.page.findMany({
        ...searchQuery,
        include: {
          author: { select: { id: true, name: true } }
        }
      })
    ])

    return { contents, pages }
  }
}
