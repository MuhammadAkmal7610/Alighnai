"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, User, Mail, Shield, Trash2, Edit, MoreVertical, Search, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/cms/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      
      // Ensure we have an array, or fallback if empty
      const userList = (data.users || []).map((u: any) => ({
        ...u,
        name: u.name || 'Anonymous User',
        status: 'ACTIVE', // Default status as it might not be in the schema currently
        lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'
      }))

      setUsers(userList)
      setError(null)
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading user management...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-navy tracking-tight">Users</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage team access, roles, and platform permissions</p>
          <div className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 w-max">
            <div className="h-1.5 w-1.5 rounded-full bg-mid-blue animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Double-click any card to edit</span>
          </div>
        </div>
        <Button className="bg-navy text-white hover:bg-navy/90 shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer group"
            onDoubleClick={() => console.log(`Editing user: ${user.name}`)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center ring-1 ring-slate-100">
                <User className="h-7 w-7 text-navy" />
              </div>
              <div className="overflow-hidden">
                <CardTitle className="text-navy text-lg font-bold truncate leading-tight">{user.name}</CardTitle>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-medium border-t border-slate-50 pt-4">
                  <span className="text-slate-400">ROLE</span>
                  <Badge className={cn(
                    "px-2 py-0.5 rounded-md shadow-none font-bold tracking-tight",
                    user.role === 'ADMIN' ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-400">STATUS</span>
                  <div className="flex items-center gap-1.5 ">
                    <div className={cn("h-2 w-2 rounded-full", user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-300')} />
                    <span className="text-navy">{user.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 h-9 border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-50 font-semibold gap-2">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-navy flex items-center gap-2">
            <Shield className="h-5 w-5 text-mid-blue" />
            Platform Access Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-14">
                <TableHead className="text-slate-600 font-bold px-6">User</TableHead>
                <TableHead className="text-slate-600 font-bold px-6">Role</TableHead>
                <TableHead className="text-slate-600 font-bold px-6">Status</TableHead>
                <TableHead className="text-slate-600 font-bold px-6">Last Login</TableHead>
                <TableHead className="text-slate-600 font-bold px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-slate-100 hover:bg-slate-50/30 transition-colors h-16 cursor-pointer group"
                  onDoubleClick={() => console.log(`Editing user: ${user.name}`)}
                >
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-navy">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-navy font-semibold">{user.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-slate-50 text-slate-500 border-slate-200">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                     <span className={cn(
                       "text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full",
                       user.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                     )}>
                       {user.status}
                     </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm px-6 font-medium">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-navy">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
