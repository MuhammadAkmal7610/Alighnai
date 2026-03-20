import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  adapter: PrismaPg | undefined
}

if (!globalForPrisma.pool) {
  if (connectionString === 'undefined' || !connectionString) {
    console.error('Prisma Client: DATABASE_URL is not defined in environment.')
  } else {
    console.log('Prisma Client: Initializing with DB host:', connectionString.split('@')[1]?.split('/')[0])
  }
  
  globalForPrisma.pool = new Pool({ 
    connectionString,
    ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
}

if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool as any)
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter: globalForPrisma.adapter as any 
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
