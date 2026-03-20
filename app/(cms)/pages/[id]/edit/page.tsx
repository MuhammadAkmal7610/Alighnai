import { notFound } from 'next/navigation'
import { ModernCMS } from '@/lib/modern-cms'
import { FullPageEditor } from '@/components/cms/FullPageEditor'

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch from CMS Page
  const page = await ModernCMS.getPageById(id)
  
  if (!page) {
    notFound()
  }

  return (
    <div className="h-screen overflow-hidden">
      <FullPageEditor initialPage={page} />
    </div>
  )
}
