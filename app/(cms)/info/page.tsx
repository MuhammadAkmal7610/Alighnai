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
import { Plus, Edit, Trash2, Eye, Phone, Mail, MapPin, FileText } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { InfoType } from '@prisma/client'

export default function InfoManager() {
  const [infoItems, setInfoItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    type: InfoType.CONTACT,
    title: '',
    content: '',
    metadata: {}
  })
  const [editingType, setEditingType] = useState<InfoType | null>(null)

  useEffect(() => {
    fetchInfo()
  }, [])

  const fetchInfo = async () => {
    try {
      const res = await fetch('/api/cms/info')
      const infoData = await res.json()
      setInfoItems(Array.isArray(infoData) ? infoData : [])
    } catch (error) {
      console.error('Failed to fetch info:', error)
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

  const getInfoIcon = (type: InfoType) => {
    switch (type) {
      case InfoType.CONTACT:
        return <Phone className="h-4 w-4" />
      case InfoType.ABOUT:
        return <FileText className="h-4 w-4" />
      case InfoType.SOCIAL:
        return <Mail className="h-4 w-4" />
      case InfoType.LEGAL:
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading info...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-navy">
      <Sidebar>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Info</h1>
              <p className="text-slate">Manage contact info, about sections, and settings</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-cyan text-navy hover:bg-cyan/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Info
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-deep-blue border-mid-blue">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingType ? 'Edit Info' : 'Add New Info'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type" className="text-light-slate">Type</Label>
                    <select
                      id="type"
                      value={formData.type as string}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as InfoType })}
                      className="w-full rounded-md border border-mid-blue bg-navy px-3 py-2 text-white"
                    >
                      <option value={InfoType.CONTACT}>Contact</option>
                      <option value={InfoType.ABOUT}>About</option>
                      <option value={InfoType.SOCIAL}>Social</option>
                      <option value={InfoType.LEGAL}>Legal</option>
                      <option value={InfoType.SETTINGS}>Settings</option>
                    </select>
                  </div>
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
                    <Label htmlFor="content" className="text-light-slate">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-navy border-mid-blue text-white"
                      rows={8}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-cyan text-navy">
                      {editingType ? 'Update Info' : 'Add Info'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowCreateDialog(false)
                      setEditingType(null)
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoItems.map((info) => (
              <Card key={info.id} className="bg-deep-blue border-mid-blue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {getInfoIcon(info.type)}
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-xs">
                      {info.type}
                    </Badge>
                    <p className="text-sm text-slate line-clamp-3">{info.content}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                       <Button size="sm" variant="outline" onClick={() => startEdit(info)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
