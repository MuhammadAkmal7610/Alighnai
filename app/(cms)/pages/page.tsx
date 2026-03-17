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
import { ContentStatus } from '@prisma/client'
import { CMSEditor } from '@/components/cms/CMSEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PagesManager() {
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

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/cms/pages')
      const pagesData = await res.json()
      setPages(Array.isArray(pagesData) ? pagesData : [])
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    try {
      const res = await fetch(`/api/cms/pages/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const startEdit = (page: any) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      template: page.template || 'default',
      metadata: page.metadata || {}
    })
    setShowCreateDialog(true)
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
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading pages...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Pages</h1>
              <p className="text-slate">Manage your website pages</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-cyan text-navy hover:bg-cyan/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Page
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-deep-blue border-mid-blue max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingId ? 'Edit Page' : 'Create New Page'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="bg-navy border border-mid-blue w-full justify-start p-1 h-auto gap-2">
                      <TabsTrigger 
                        value="content" 
                        className="data-[state=active]:bg-cyan data-[state=active]:text-navy text-light-slate px-4 py-2"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger 
                        value="metadata" 
                        className="data-[state=active]:bg-cyan data-[state=active]:text-navy text-light-slate px-4 py-2"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Page Attributes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-light-slate">Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-navy border-mid-blue text-white"
                            placeholder="e.g., Home"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-light-slate">URL Slug</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="bg-navy border-mid-blue text-white"
                            placeholder="e.g., home"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-light-slate">Page Content</Label>
                        <CMSEditor 
                          content={formData.content} 
                          onChange={(content) => setFormData({ ...formData, content })} 
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="metadata" className="mt-6 space-y-4">
                      <div className="p-4 border border-dashed border-mid-blue/50 rounded-lg space-y-4 bg-navy/30">
                        <h4 className="text-sm font-semibold text-cyan flex items-center gap-2">
                          <Layout className="w-4 h-4" />
                          Hero Section Customization
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate uppercase">Hero Title Override</Label>
                            <Input
                              value={(formData.metadata as any)?.hero?.title || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                metadata: { 
                                  ...(formData.metadata || {}), 
                                  hero: { ...((formData.metadata as any)?.hero || {}), title: e.target.value } 
                                } 
                              })}
                              className="bg-navy border-mid-blue text-white text-sm"
                              placeholder="Leave empty for default"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate uppercase">Hero Description Override</Label>
                            <Textarea
                              value={(formData.metadata as any)?.hero?.description || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                metadata: { 
                                  ...(formData.metadata || {}), 
                                  hero: { ...((formData.metadata as any)?.hero || {}), description: e.target.value } 
                                } 
                              })}
                              className="bg-navy border-mid-blue text-white text-sm"
                              rows={3}
                              placeholder="Leave empty for default"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-light-slate">Raw Metadata (Advanced)</Label>
                        <Textarea
                          id="metadata"
                          value={JSON.stringify(formData.metadata, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value)
                              setFormData({ ...formData, metadata: parsed })
                            } catch (err) {}
                          }}
                          className="bg-navy border-mid-blue text-white font-mono text-xs"
                          rows={6}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-3 pt-4 border-t border-mid-blue/30 mt-6">
                    <Button type="submit" className="bg-cyan text-navy">
                      {editingId ? 'Update Page' : 'Create Page'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowCreateDialog(false)
                      setEditingId(null)
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-deep-blue border-mid-blue">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate">Title</TableHead>
                    <TableHead className="text-slate">Slug</TableHead>
                    <TableHead className="text-slate">Template</TableHead>
                    <TableHead className="text-slate">Status</TableHead>
                    <TableHead className="text-slate">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id} className="border-mid-blue">
                      <TableCell className="text-white">{page.title}</TableCell>
                      <TableCell className="text-slate">{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {page.template}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={page.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={page.slug === 'home' ? '/site' : `/site/${page.slug}`} target="_blank">
                            <Button size="sm" variant="outline" title="View Page">
                              <Eye className="h-3 w-3 text-cyan" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => startEdit(page)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(page.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  )
}
