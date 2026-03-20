import { notFound } from 'next/navigation'
import { ModernCMS } from '@/lib/modern-cms'
import { PageRenderer } from '@/components/cms/PageRenderer'

export default async function CMSPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  
  // Try to find the page in the CMS
  const page = await ModernCMS.getPageBySlug(slugPath)
  
  if (!page || page.status !== 'PUBLISHED') {
    notFound()
  }

  return <PageRenderer page={page} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  const page = await ModernCMS.getPageBySlug(slugPath)
  if (!page) return { title: 'Page Not Found' }
  
  return {
    title: page.title,
    description: (page.metadata as any)?.description || `Learn more about ${page.title}`
  }
}
