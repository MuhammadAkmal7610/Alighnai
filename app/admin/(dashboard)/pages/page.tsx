"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Eye, Layout, Settings, FileText } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { CMSEditor } from '@/components/cms/CMSEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { useRouter } from 'next/navigation'

export default function PagesManager() {
  const router = useRouter()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    template: 'default',
    metadata: {}
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<any>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/cms/pages')
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.details || `Server responded with ${res.status}`)
      }

      const pagesData = await res.json()
      setPages(Array.isArray(pagesData) ? pagesData : [])
    } catch (error: any) {
      console.error('CMS: Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (page: any) => {
    setPageToDelete(page)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!pageToDelete) return
    try {
      const res = await fetch(`/api/cms/pages/${pageToDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchPages()
        setShowDeleteDialog(false)
        setPageToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const startEdit = (page: any) => {
    router.push(`/admin/pages/${page.id}/edit`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/cms/pages/${editingId}` : '/api/cms/pages'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        await fetchPages()
        setShowCreateDialog(false)
        setEditingId(null)
        setFormData({
          title: '',
          slug: '',
          content: '',
          template: 'default',
          metadata: {}
        })
      }
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading pages...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold text-navy tracking-tight">Pages</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage your website's structural architecture</p>
              <div className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 w-max">
                <div className="h-1.5 w-1.5 rounded-full bg-mid-blue animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Double-click any row to edit</span>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-navy text-white hover:bg-navy/90 shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Page
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <DialogHeader className="border-b border-slate-100 pb-4 mb-6">
                  <DialogTitle className="text-2xl font-bold text-navy">
                    {editingId ? 'Edit Page' : 'Create New Page'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="bg-slate-50 border border-slate-200 w-full justify-start p-1 h-auto gap-2 rounded-lg">
                      <TabsTrigger 
                        value="content" 
                        className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-slate-500 px-6 py-2.5 font-semibold transition-all"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger 
                        value="metadata" 
                        className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-slate-500 px-6 py-2.5 font-semibold transition-all"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Page Attributes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-bold text-navy">Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-white border-slate-200 text-navy focus:ring-mid-blue focus:border-mid-blue rounded-lg h-11"
                            placeholder="e.g., Home"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-bold text-navy">URL Slug</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="bg-white border-slate-200 text-navy focus:ring-mid-blue focus:border-mid-blue rounded-lg h-11"
                            placeholder="e.g., home"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template" className="text-sm font-bold text-navy">Page Template</Label>
                        <select
                          id="template"
                          value={formData.template}
                          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-navy focus:ring-mid-blue focus:border-mid-blue rounded-lg h-11 px-3 font-medium cursor-pointer"
                        >
                          <option value="blank">Blank Page (New Content)</option>
                          <option value="home">Home Template (Enterprise Governance Focus)</option>
                          <option value="about">About Template (Founder Focus)</option>
                          <option value="framework">Framework Template (Architecture Focus)</option>
                          <option value="services">Services Template</option>
                          <option value="contact">Contact Template</option>
                          <option value="insights">Insights Template</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-bold text-navy">Page Content</Label>
                        <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <CMSEditor 
                            content={formData.content} 
                            onChange={(content) => setFormData({ ...formData, content })} 
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="metadata" className="mt-8 space-y-6">
                      <div className="p-6 border border-slate-200 rounded-xl space-y-5 bg-slate-50/50">
                        <h4 className="text-sm font-bold text-mid-blue flex items-center gap-2 uppercase tracking-wider">
                          <Layout className="w-4 h-4" />
                          Hero Section Customization
                        </h4>
                        <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Hero Title Override</Label>
                            <Input
                              value={(formData.metadata as any)?.hero?.title || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                metadata: { 
                                  ...(formData.metadata || {}), 
                                  hero: { ...((formData.metadata as any)?.hero || {}), title: e.target.value } 
                                } 
                              })}
                              className="bg-white border-slate-200 text-navy text-sm h-10 rounded-lg"
                              placeholder="Leave empty for default"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Hero Description Override</Label>
                            <Textarea
                              value={(formData.metadata as any)?.hero?.description || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                metadata: { 
                                  ...(formData.metadata || {}), 
                                  hero: { ...((formData.metadata as any)?.hero || {}), description: e.target.value } 
                                } 
                              })}
                              className="bg-white border-slate-200 text-navy text-sm rounded-lg min-h-[100px]"
                              placeholder="Leave empty for default"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border border-slate-200 rounded-xl space-y-5 bg-white">
                        <h4 className="text-sm font-bold text-mid-blue flex items-center gap-2 uppercase tracking-wider">
                          <Settings className="w-4 h-4" />
                          SEO (search & social)
                        </h4>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Meta title (optional)</Label>
                          <Input
                            value={String((formData.metadata as Record<string, string>)?.seoTitle ?? '')}
                            onChange={(e) => setFormData({
                              ...formData,
                              metadata: {
                                ...(formData.metadata || {}),
                                seoTitle: e.target.value,
                              },
                            })}
                            className="bg-white border-slate-200 text-navy text-sm h-10 rounded-lg"
                            placeholder="Defaults to page title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Meta description</Label>
                          <Textarea
                            value={String((formData.metadata as Record<string, string>)?.seoDescription ?? '')}
                            onChange={(e) => setFormData({
                              ...formData,
                              metadata: {
                                ...(formData.metadata || {}),
                                seoDescription: e.target.value,
                              },
                            })}
                            className="bg-white border-slate-200 text-navy text-sm rounded-lg min-h-[88px]"
                            placeholder="Google / social preview text"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Social image URL (optional)</Label>
                          <Input
                            value={String((formData.metadata as Record<string, string>)?.ogImage ?? '')}
                            onChange={(e) => setFormData({
                              ...formData,
                              metadata: {
                                ...(formData.metadata || {}),
                                ogImage: e.target.value,
                              },
                            })}
                            className="bg-white border-slate-200 text-navy text-sm h-10 rounded-lg"
                            placeholder="https://…"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-navy">Raw Metadata (Advanced)</Label>
                        <Textarea
                          id="metadata"
                          value={JSON.stringify(formData.metadata, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value)
                              setFormData({ ...formData, metadata: parsed })
                            } catch (err) {}
                          }}
                          className="bg-slate-50 border-slate-200 text-navy font-mono text-xs rounded-lg min-h-[150px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                    <Button type="button" variant="outline" onClick={() => {
                        setShowCreateDialog(false)
                        setEditingId(null)
                      }}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-navy text-white hover:bg-navy/90 px-8 shadow-md">
                      {editingId ? 'Update Page' : 'Create Page'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 h-14">
                    <TableHead className="text-slate-600 font-bold px-6">Title</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Slug</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Template</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Status</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow 
                      key={page.id} 
                      className="border-slate-100 hover:bg-slate-50/30 transition-colors h-16 cursor-pointer group"
                      onDoubleClick={() => startEdit(page)}
                    >
                      <TableCell className="text-navy font-semibold px-6">{page.title}</TableCell>
                      <TableCell className="text-slate-500 font-medium px-6">/{page.slug}</TableCell>
                      <TableCell className="px-6">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 border-slate-200 px-2 py-0.5">
                          {page.template}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge 
                          variant={page.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-tight shadow-none px-2 py-0.5",
                            page.status === 'PUBLISHED' 
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                          )}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex gap-2">
                          <Link href={page.slug === 'home' ? '/site' : `/site/${page.slug}`} target="_blank">
                            <Button size="sm" variant="outline" title="View Page" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-mid-blue hover:bg-blue-50">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => startEdit(page)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => confirmDelete(page)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="bg-white border-slate-200 max-w-md shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-navy flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  Delete Page
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-600">
                  Are you sure you want to delete <span className="font-bold text-navy">"{pageToDelete?.title}"</span>? 
                  This action cannot be undone and the page will be permanently removed.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700 px-6 shadow-md"
                >
                  Delete Permanently
                </Button>
              </div>
            </DialogContent>
          </Dialog>
    </div>
  )
}
