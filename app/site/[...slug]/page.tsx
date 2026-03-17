import { notFound } from 'next/navigation'
import { ModernCMS } from '@/lib/modern-cms'
import { CTASection } from '@/components/CTASection'

export default async function CMSPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  
  // Try to find the page in the CMS
  const page = await ModernCMS.getPageBySlug(slugPath)
  
  if (!page || page.status !== 'PUBLISHED') {
    // If it's the home slug and we have a static home, we might not want to 404 here
    // but the statutory home is at /home and this component is at /[slug]
    notFound()
  }

  return (
    <div className="bg-navy min-h-screen pt-20">
      <div className="container-main py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">{page.title}</h1>
        <div className="prose prose-invert max-w-none text-light-slate leading-relaxed">
          {/* Using a simple div for now, in a real app would use a markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </div>
      <CTASection />
    </div>
  )
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
