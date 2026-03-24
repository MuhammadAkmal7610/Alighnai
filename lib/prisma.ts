import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  adapter: PrismaPg | undefined
}

const connectionString = `${process.env.DATABASE_URL}`

if (connectionString === 'undefined' || !connectionString) {
  console.error('Prisma Client: DATABASE_URL is not defined in environment.')
} else if (!globalForPrisma.prisma) {
  console.log('Prisma Client: Initializing with DB host:', connectionString.split('@')[1]?.split('/')[0])
}

const pool = globalForPrisma.pool ?? new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false
})

const adapter = globalForPrisma.adapter ?? new PrismaPg(pool as any)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: adapter as any })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
  globalForPrisma.adapter = adapter
}
