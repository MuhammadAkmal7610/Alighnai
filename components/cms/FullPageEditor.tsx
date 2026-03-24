"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Save, 
  Send, 
  X, 
  ChevronLeft, 
  Settings, 
  Eye, 
  Globe,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { PageRenderer } from './PageRenderer'
import { cn } from '@/lib/utils'
import { ContentStatus } from '@prisma/client'

interface FullPageEditorProps {
  initialPage: any
}

export function FullPageEditor({ initialPage }: FullPageEditorProps) {
  const router = useRouter()
  const [page, setPage] = useState(initialPage)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleSave = async (status?: ContentStatus) => {
    try {
      setSaving(true)
      setSaveStatus('saving')
      
      const updateData = {
        ...page,
        status: status || page.status
      }

      const res = await fetch(`/api/cms/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!res.ok) throw new Error('Failed to save page')

      const updatedPage = await res.json()
      setPage(updatedPage)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving page:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const updateMetadata = (newMetadata: any) => {
    setPage({ ...page, metadata: newMetadata })
  }

  const updateContent = (newContent: string) => {
    setPage({ ...page, content: newContent })
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* Top Toolbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/pages')}
            className="text-slate-500 hover:text-navy"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Editing Page</span>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-navy truncate max-w-[200px]">{page.title}</h1>
              <span className={cn(
                "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                page.status === 'PUBLISHED' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              )}>
                {page.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center text-green-600 text-xs font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Saved
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSave('DRAFT' as ContentStatus)}
            disabled={saving}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Save className={cn("w-4 h-4 mr-2", saving && "animate-spin")} />
            Save Draft
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleSave('PUBLISHED' as ContentStatus)}
            disabled={saving}
            className="bg-navy text-white hover:bg-navy/90 px-6 shadow-md"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Publish Changes
          </Button>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        <div className="max-w-[1200px] mx-auto py-10 px-6">
          {/* Page Settings (Floating or Sidebar alternative) */}
          <div className="mb-10 grid grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Title</Label>
              <Input 
                value={page.title} 
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="bg-white border-slate-200 focus:ring-navy focus:border-navy h-10 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Slug</Label>
              <Input 
                value={page.slug} 
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                className="bg-white border-slate-200 focus:ring-navy focus:border-navy h-10 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Design Template</Label>
              <select
                value={page.template || ''}
                onChange={(e) => setPage({ ...page, template: e.target.value })}
                className="w-full bg-white border border-slate-200 text-sm focus:ring-navy focus:border-navy h-10 px-3 rounded-md font-medium cursor-pointer"
              >
                <option value="home">Home Template (Enterprise)</option>
                <option value="about">About Template (Founder)</option>
                <option value="framework">Framework Template (Architecture)</option>
                <option value="services">Services Template (Engagement)</option>
                <option value="contact">Contact Template (Direct)</option>
                <option value="blank">Blank (Default Content Only)</option>
              </select>
            </div>
          </div>

          {/* Live Preview / Renderer */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-2xl bg-navy ring-8 ring-slate-100">
            <PageRenderer 
              page={page} 
              isEditing={true} 
              onContentChange={updateContent}
              onMetadataChange={updateMetadata}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
