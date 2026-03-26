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
import { Plus, Edit, Trash2, Eye, Phone, Mail, MapPin, FileText, Info as InfoIcon, Globe, Map } from 'lucide-react'
import { InfoType, type InfoType as InfoTypeValue } from '@/lib/cms-enums'
import { cn } from '@/lib/utils'
import { CMS_H1, CMS_PAGE_HEADER, CMS_PAGE_SHELL } from '@/lib/cms-page-shell'
import { CMSEditor } from '@/components/cms/CMSEditor'

export default function InfoManager() {
  const [infoItems, setInfoItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState<{
    type: InfoTypeValue,
    title: string,
    content: string,
    metadata: any
  }>({
    type: InfoType.CONTACT,
    title: '',
    content: '',
    metadata: {}
  })
  const [editingType, setEditingType] = useState<InfoTypeValue | null>(null)

  useEffect(() => {
    fetchInfo()
  }, [])

  const fetchInfo = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/cms/info')
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.details || `Server responded with ${res.status}`)
      }

      const infoData = await res.json()
      console.log('Successfully fetched info items:', infoData)
      setInfoItems(Array.isArray(infoData) ? infoData : [])
    } catch (error: any) {
      console.error('CMS: Failed to fetch info:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (info: any) => {
    setEditingType(info.type)
    setFormData({
      type: info.type,
      title: info.title,
      content: info.content,
      metadata: info.metadata || {}
    })
    setShowCreateDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingType ? `/api/cms/info/${editingType}` : '/api/cms/info'
      const method = editingType ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchInfo()
        setShowCreateDialog(false)
        setEditingType(null)
        setFormData({
          type: InfoType.CONTACT,
          title: '',
          content: '',
          metadata: {}
        })
      }
    } catch (error) {
      console.error('Failed to create info:', error)
    }
  }

  const getInfoIcon = (type: InfoTypeValue) => {
    switch (type) {
      case InfoType.CONTACT:
        return <Phone className="h-5 w-5 text-mid-blue" />
      case InfoType.ABOUT:
        return <FileText className="h-5 w-5 text-green-600" />
      case InfoType.SOCIAL:
        return <Globe className="h-5 w-5 text-blue-500" />
      case InfoType.LEGAL:
        return <InfoIcon className="h-5 w-5 text-red-500" />
      case InfoType.SETTINGS:
        return <Map className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-slate-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading info categories...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-navy tracking-tight">Info & Assets</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage company information, contact details, and global settings</p>
          <div className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 w-max">
            <div className="h-1.5 w-1.5 rounded-full bg-mid-blue animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Double-click any card to edit</span>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-navy text-white hover:bg-navy/90 shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4 mb-6">
              <DialogTitle className="text-2xl font-bold text-navy">
                {editingType ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-bold text-navy">Category Type</Label>
                  <select
                    id="type"
                    value={formData.type as string}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as InfoTypeValue })}
                    disabled={!!editingType}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-navy focus:ring-2 focus:ring-mid-blue/30 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value={InfoType.CONTACT}>Contact Info</option>
                    <option value={InfoType.ABOUT}>About Content</option>
                    <option value={InfoType.SOCIAL}>Social Media</option>
                    <option value={InfoType.LEGAL}>Legal Content</option>
                    <option value={InfoType.SETTINGS}>Global Settings</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold text-navy">Display Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white border-slate-200 text-navy h-11 rounded-lg"
                    placeholder="e.g., Office Address"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-bold text-navy">Main Content</Label>
                <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white">
                  <CMSEditor 
                    content={formData.content} 
                    onChange={(val) => setFormData({ ...formData, content: val })} 
                    placeholder="Primary content or text"
                    minHeight="150px"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metadata" className="text-sm font-bold text-navy">Structured Metadata (JSON)</Label>
                <Textarea
                  id="metadata"
                  value={JSON.stringify(formData.metadata, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setFormData({ ...formData, metadata: parsed })
                    } catch (err) {}
                  }}
                  className="bg-slate-50 border-slate-200 text-navy font-mono text-xs rounded-lg min-h-[180px]"
                  placeholder="{}"
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => {
                    setShowCreateDialog(false)
                    setEditingType(null)
                  }}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-navy text-white hover:bg-navy/90 px-8 shadow-md">
                  {editingType ? 'Update Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoItems.map((info) => (
          <Card 
            key={info.id} 
            className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer group"
            onDoubleClick={() => startEdit(info)}
          >
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
              <CardTitle className="flex items-center gap-3 text-navy text-lg font-bold">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                  {getInfoIcon(info.type)}
                </div>
                {info.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-500 border-slate-200 px-2 py-0.5">
                  {info.type}
                </Badge>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                  {info.content}
                </p>
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => startEdit(info)} className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
