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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { ContentType, ContentStatus } from '@prisma/client'
import { CMSEditor } from '@/components/cms/CMSEditor'

export default function ContentManager() {
  const [contents, setContents] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
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

      try {
        if (contentsRes.ok) contentsData = await contentsRes.json()
      } catch (e) { console.error('Contents parse error', e) }

      try {
        if (categoriesRes.ok) categoriesData = await categoriesRes.json()
      } catch (e) { console.error('Categories parse error', e) }
      
      setContents(contentsData.posts || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
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
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Content</h1>
              <p className="text-slate">Manage your blog posts and articles</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-cyan text-navy hover:bg-cyan/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-deep-blue border-mid-blue">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingId ? 'Edit Content' : 'Create New Content'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-light-slate">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-light-slate">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ContentType })}>
                      <SelectTrigger className="bg-navy border-mid-blue text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy border-mid-blue">
                        <SelectItem value={ContentType.BLOG_POST}>Blog Post</SelectItem>
                        <SelectItem value={ContentType.ARTICLE}>Article</SelectItem>
                        <SelectItem value={ContentType.NEWS}>News</SelectItem>
                        <SelectItem value={ContentType.CASE_STUDY}>Case Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="excerpt" className="text-light-slate">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content" className="text-light-slate">Content</Label>
                    <CMSEditor 
                      content={formData.content} 
                      onChange={(content) => setFormData({ ...formData, content })} 
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-cyan text-navy">
                      {editingId ? 'Update Content' : 'Create Content'}
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
                    <TableHead className="text-slate">Type</TableHead>
                    <TableHead className="text-slate">Status</TableHead>
                    <TableHead className="text-slate">Author</TableHead>
                    <TableHead className="text-slate">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.map((content) => (
                    <TableRow key={content.id} className="border-mid-blue">
                      <TableCell className="text-white">{content.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {content.type?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={content.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {content.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate">{content.author?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/preview/insights/${content.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => startEdit(content)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(content.id)}>
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
