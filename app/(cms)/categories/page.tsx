"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Eye, Tag } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#0ea5e9',
    icon: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/cms/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`/api/cms/categories/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const startEdit = (category: any) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#0ea5e9',
      icon: category.icon || ''
    })
    setShowCreateDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/cms/categories/${editingId}` : '/api/cms/categories'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchCategories()
        setShowCreateDialog(false)
        setEditingId(null)
        setFormData({
          name: '',
          slug: '',
          description: '',
          color: '#0ea5e9',
          icon: ''
        })
      }
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-navy">
      <Sidebar>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Categories</h1>
              <p className="text-slate">Manage content categories</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-cyan text-navy hover:bg-cyan/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-deep-blue border-mid-blue">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingId ? 'Edit Category' : 'Create New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-light-slate">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-light-slate">Slug (optional)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      placeholder="leave-blank-to-auto-generate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-light-slate">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color" className="text-light-slate">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-full bg-navy border-mid-blue"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-cyan text-navy">
                      {editingId ? 'Update Category' : 'Create Category'}
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
                    <TableHead className="text-slate w-12"></TableHead>
                    <TableHead className="text-slate">Name</TableHead>
                    <TableHead className="text-slate">Slug</TableHead>
                    <TableHead className="text-slate">Description</TableHead>
                    <TableHead className="text-slate">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="border-mid-blue">
                      <TableCell>
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: category.color || '#0ea5e9' }}
                        />
                      </TableCell>
                      <TableCell className="text-white font-medium">{category.name}</TableCell>
                      <TableCell className="text-slate">{category.slug}</TableCell>
                      <TableCell className="text-slate line-clamp-1 max-w-xs">{category.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(category)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
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
      </Sidebar>
    </div>
  )
}
