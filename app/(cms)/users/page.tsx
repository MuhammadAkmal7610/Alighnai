"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, User, Mail, Shield, Trash2, Edit } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we'd fetch users from an API
    // For now, let's mock some data or use a fallback
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Assuming we have an API for users
      // const res = await fetch('/api/cms/users')
      // const data = await res.json()
      // setUsers(data)
      
      // Mock data for now
      setUsers([
        { id: '1', name: 'Admin User', email: 'admin@alignai.com', role: 'ADMIN', createdAt: new Date() },
        { id: '2', name: 'Editor One', email: 'editor@alignai.com', role: 'EDITOR', createdAt: new Date() },
      ])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-navy">
      <Sidebar>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Users</h1>
              <p className="text-slate">Manage CMS access and roles</p>
            </div>
            <Button className="bg-cyan text-navy hover:bg-cyan/90">
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.map((user) => (
              <Card key={user.id} className="bg-deep-blue border-mid-blue">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-navy border border-mid-blue flex items-center justify-center">
                    <User className="h-6 w-6 text-cyan" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{user.name}</CardTitle>
                    <p className="text-xs text-slate">{user.email}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-mid-blue text-white">
                      {user.role}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
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
