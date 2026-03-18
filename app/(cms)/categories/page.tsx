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
import { Plus, Edit, Trash2, Tag, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#407BB7',
    icon: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/cms/categories')
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.details || `Server responded with ${res.status}`)
      }

      const data = await res.json()
      console.log('Successfully fetched categories:', data)
      setCategories(data.categories || [])
    } catch (error: any) {
      console.error('CMS: Failed to fetch categories:', error)
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
      color: category.color || '#407BB7',
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
          color: '#407BB7',
          icon: ''
        })
      }
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold text-navy tracking-tight">Categories</h1>
              <p className="text-slate-500 mt-1 font-medium">Organize your content with meaningful classifications</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-navy text-white hover:bg-navy/90 shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-slate-200 max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <DialogHeader className="border-b border-slate-100 pb-4 mb-6">
                  <DialogTitle className="text-2xl font-bold text-navy">
                    {editingId ? 'Edit Category' : 'Create New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-bold text-navy">Display Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white border-slate-200 text-navy h-11 rounded-lg"
                        placeholder="e.g., Artificial Intelligence"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-sm font-bold text-navy">Slug (Auto-generated if empty)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="bg-white border-slate-200 text-navy h-11 rounded-lg"
                        placeholder="e.g., artificial-intelligence"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-navy">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white border-slate-200 text-navy rounded-lg min-h-[100px]"
                      placeholder="Brief description of this category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-bold text-navy">Accent Color</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="h-11 w-24 bg-white border-slate-200 p-1 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 font-mono">{formData.color}</span>
                    </div>
                  </div>
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
                      {editingId ? 'Update Category' : 'Create Category'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
             <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-navy flex items-center gap-2">
                <Tag className="h-5 w-5 text-mid-blue" />
                Active Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 h-14">
                    <TableHead className="text-slate-600 font-bold px-6 w-16 text-center">Color</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Name</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Slug</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6">Description</TableHead>
                    <TableHead className="text-slate-600 font-bold px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors h-16">
                        <TableCell className="px-6 text-center">
                          <div 
                            className="h-6 w-6 rounded-full mx-auto shadow-sm border border-slate-100" 
                            style={{ backgroundColor: category.color || '#407BB7' }}
                          />
                        </TableCell>
                        <TableCell className="text-navy font-bold px-6">{category.name}</TableCell>
                        <TableCell className="text-slate-500 font-mono text-sm px-6">/{category.slug}</TableCell>
                        <TableCell className="text-slate-500 text-sm px-6 max-w-xs truncate font-medium">{category.description}</TableCell>
                        <TableCell className="px-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => startEdit(category)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                        No categories found
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
