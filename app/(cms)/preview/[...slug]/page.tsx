import { notFound } from 'next/navigation'
import { ModernCMS } from '@/lib/modern-cms'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { Badge } from '@/components/ui/badge'

export default async function CMSPreviewPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugPath = slug.join('/')
  
  // Look for page first
  let title = ''
  let content = ''
  let type = 'PAGE'
  let status = 'DRAFT'
  let updatedAt = new Date()

  const page = await ModernCMS.getPageBySlug(slugPath)
  if (page) {
    title = page.title
    content = page.content
    status = page.status
    updatedAt = page.updatedAt
  } else {
    // Try insight/post
    // Slug for insights starts with 'insights/'
    if (slug[0] === 'insights') {
      const insightSlug = slug.slice(1).join('/')
      const post = await ModernCMS.getContentBySlug(insightSlug)
      if (post) {
        title = post.title
        content = post.content
        type = post.type
        status = post.status
        updatedAt = post.updatedAt
      } else {
        notFound()
      }
    } else {
      notFound()
    }
  }

  return (
    <div className="flex h-screen bg-navy text-white overflow-hidden">
      <Sidebar>
        <div className="flex-1 flex flex-col h-full">
          {/* Internal CMS Header */}
          <div className="bg-deep-blue border-b border-mid-blue p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Internal Preview</h1>
              <Badge variant={status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {status}
              </Badge>
              <span className="text-xs text-slate">
                Last updated: {new Date(updatedAt).toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-slate uppercase tracking-wider font-semibold">
              CMS Protected View
            </div>
          </div>
          
          {/* Content Area - Isolated from public website styles */}
          <div className="flex-1 overflow-auto p-8 md:p-12 lg:p-20 bg-navy">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <p className="text-cyan text-xs font-bold uppercase tracking-widest mb-2">{type.replace('_', ' ')}</p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>
              </div>
              
              <div className="prose prose-invert max-w-none prose-slate prose-headings:text-white prose-a:text-cyan prose-strong:text-white">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
