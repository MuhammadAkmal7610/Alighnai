"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Eye, FileText, Calendar, Layout, Search } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { ContentType, ContentStatus } from '@prisma/client'
import { CMSEditor } from '@/components/cms/CMSEditor'
import { cn } from '@/lib/utils'

export default function ContentManager() {
  const [contents, setContents] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    type: ContentType;
    status: ContentStatus;
    featured: boolean;
    categoryId: string;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    type: ContentType.BLOG_POST,
    status: ContentStatus.DRAFT,
    featured: false,
    categoryId: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [contentsRes, categoriesRes] = await Promise.all([
        fetch('/api/cms/posts'),
        fetch('/api/cms/categories')
      ])
      
      let contentsData = { posts: [] }
      let categoriesData = { categories: [] }

      if (contentsRes.ok) {
        contentsData = await contentsRes.json()
      }

      if (categoriesRes.ok) {
        categoriesData = await categoriesRes.json()
      }
      
      setContents(contentsData.posts || [])
      setCategories(categoriesData.categories || [])
    } catch (error: any) {
      console.error('CMS: Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return
    try {
      const res = await fetch(`/api/cms/posts/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchData()
    } catch (error) {
      console.error('Failed to delete content:', error)
    }
  }

  const startEdit = (content: any) => {
    setEditingId(content.id)
    setFormData({
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt || '',
      content: content.content,
      type: content.type,
      status: content.status,
      featured: content.featured,
      categoryId: content.categoryId || ''
    })
    setShowCreateDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/cms/posts/${editingId}` : '/api/cms/posts'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchData()
        setShowCreateDialog(false)
        setEditingId(null)
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          type: ContentType.BLOG_POST,
          status: ContentStatus.DRAFT,
          featured: false,
          categoryId: ''
        })
      }
    } catch (error) {
      console.error('Failed to create content:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading content manager...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold text-navy tracking-tight">Content</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage your articles, blog posts, and resources</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-navy text-white hover:bg-navy/90 shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-slate-200 max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <DialogHeader className="border-b border-slate-100 pb-4 mb-6">
                  <DialogTitle className="text-2xl font-bold text-navy">
                    {editingId ? 'Edit Content' : 'Create New Content'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-bold text-navy">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-white border-slate-200 text-navy h-11 rounded-lg"
                        placeholder="Article title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-bold text-navy">Content Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ContentType })}>
                        <SelectTrigger className="bg-white border-slate-200 text-navy h-11 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          <SelectItem value={ContentType.BLOG_POST}>Blog Post</SelectItem>
                          <SelectItem value={ContentType.ARTICLE}>Article</SelectItem>
                          <SelectItem value={ContentType.NEWS}>News</SelectItem>
                          <SelectItem value={ContentType.CASE_STUDY}>Case Study</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-bold text-navy">Excerpt / Summary</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="bg-white border-slate-200 text-navy rounded-lg min-h-[80px]"
                      placeholder="Brief summary used in listings"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-bold text-navy">Body Content</Label>
                    <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                      <CMSEditor 
                        content={formData.content} 
                        onChange={(content) => setFormData({ ...formData, content })} 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={() => {
                        setShowCreateDialog(false)
                        setEditingId(null)
                      }}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-navy text-white hover:bg-navy/90 px-8 shadow-md">
                      {editingId ? 'Update Content' : 'Publish Content'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-navy flex items-center gap-2">
                <FileText className="h-5 w-5 text-mid-blue" />
                Existing Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 h-14">
                    <TableHead className="text-slate-600 font-bold px-6">Title</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Type</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Status</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Updated</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.length > 0 ? (
                    contents.map((content) => (
                      <TableRow key={content.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors h-16">
                        <TableCell className="text-navy font-semibold px-6">{content.title}</TableCell>
                        <TableCell className="px-6">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 border-slate-200 px-2 py-0.5">
                            {content.type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge 
                            variant={content.status === 'PUBLISHED' ? 'default' : 'secondary'}
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-tight shadow-none px-2 py-0.5",
                              content.status === 'PUBLISHED' 
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                                : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                            )}
                          >
                            {content.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm px-6">
                          {new Date(content.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="flex gap-2">
                            <Link href={`/preview/insights/${content.slug}`} target="_blank">
                              <Button size="sm" variant="outline" title="Preview" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-mid-blue hover:bg-blue-50">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" onClick={() => startEdit(content)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(content.id)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                        No content items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  )
}
