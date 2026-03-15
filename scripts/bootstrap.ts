import 'dotenv/config'
import { UserRole, InfoType, ContentStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🚀 Bootstrapping initial CMS data...')

  // 1. Create Default Admin User
  const adminEmail = 'admin@alignai-website.com'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'System Admin',
      role: UserRole.ADMIN,
      bio: 'Primary administrator for the AlignAI CMS.',
    },
  })
  console.log('✅ Admin user created/verified:', admin.email)

  // 2. Create Default Categories
  const categories = [
    { name: 'Governance', slug: 'governance', color: '#0ea5e9' },
    { name: 'Strategy', slug: 'strategy', color: '#f59e0b' },
    { name: 'Research', slug: 'research', color: '#10b981' },
    { name: 'Enterprise', slug: 'enterprise', color: '#6366f1' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Default categories created.')

  // 3. Create Default Info Items
  const infoItems = [
    {
      type: InfoType.CONTACT,
      title: 'Contact Information',
      content: 'Get in touch with the AlignAI team.',
      metadata: {
        email: 'info@alignai.com',
        phone: '+1 (555) 000-0000',
        address: 'Ottawa, Canada',
      },
    },
    {
      type: InfoType.SOCIAL,
      title: 'Social Media',
      content: 'Follow us on social platforms for updates.',
      metadata: {
        linkedin: 'https://linkedin.com/company/alignai',
        twitter: 'https://twitter.com/alignai',
      },
    },
    {
      type: InfoType.ABOUT,
      title: 'About AlignAI',
      content: 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.',
    },
    {
      type: InfoType.SETTINGS,
      title: 'General Settings',
      content: 'Global website configuration options.',
      metadata: {
        siteName: 'AlignAI',
        tagline: 'Enterprise AI Governance Architecture',
      },
    },
  ]

  for (const item of infoItems) {
    await prisma.info.upsert({
      where: { type: item.type },
      update: item,
      create: item,
    })
  }
  console.log('✅ Default info items created.')

  // 4. Create Initial Pages
  const pages = [
    {
      title: 'Home',
      slug: 'home',
      content: 'This is the home page content managed by the CMS.',
      status: ContentStatus.PUBLISHED,
      template: 'default',
    },
    {
      title: 'About',
      slug: 'about',
      content: 'This is the about page content managed by the CMS.',
      status: ContentStatus.PUBLISHED,
      template: 'default',
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        ...page,
        authorId: admin.id,
      },
    })
  }
  console.log('✅ Default pages created.')

  console.log('✨ Bootstrapping complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error during bootstrapping:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
