"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, FileText, Users, Eye, TrendingUp, Calendar, Home, Grid3x3, Settings, Menu } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { cn } from '@/lib/utils'

export default function ModernDashboard() {
  const [stats, setStats] = useState({
    totalContents: 0,
    publishedContents: 0,
    draftContents: 0,
    totalPages: 0,
    publishedPages: 0,
    totalCategories: 0,
    totalUsers: 0
  })
  const [recentContent, setRecentContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, contentRes] = await Promise.all([
        fetch('/api/cms/stats'),
        fetch('/api/cms/posts?take=5')
      ])
      
      let statsData = { totalContents: 0, publishedContents: 0, draftContents: 0, totalPages: 0, publishedPages: 0, totalCategories: 0, totalUsers: 0 }
      let contentData = { posts: [] }

      if (statsRes.ok) {
        statsData = await statsRes.json()
      } else {
        const err = await statsRes.json().catch(() => ({}))
        console.error('CMS: Failed to fetch stats:', err.details || statsRes.status)
      }

      if (contentRes.ok) {
        contentData = await contentRes.json()
      } else {
        const err = await contentRes.json().catch(() => ({}))
        console.error('CMS: Failed to fetch recent posts:', err.details || contentRes.status)
      }
      
      setStats(statsData)
      setRecentContent(contentData.posts || [])
    } catch (error: any) {
      console.error('CMS: Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-navy tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">Welcome back to your AlignAI CMS</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Content</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-mid-blue" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-navy">{stats.totalContents}</div>
                <p className="text-xs text-slate-400 mt-1">All content items</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Published</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-navy">{stats.publishedContents}</div>
                <p className="text-xs text-slate-400 mt-1">Live content</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Drafts</CardTitle>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <FileText className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-navy">{stats.draftContents}</div>
                <p className="text-xs text-slate-400 mt-1">Draft content</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</CardTitle>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Menu className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-navy">{stats.totalCategories}</div>
                <p className="text-xs text-slate-400 mt-1">Content categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Content */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg font-bold text-navy flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mid-blue" />
                Recent Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-slate-600 font-bold">Title</TableHead>
                    <TableHead className="text-slate-600 font-bold">Type</TableHead>
                    <TableHead className="text-slate-600 font-bold">Status</TableHead>
                    <TableHead className="text-slate-600 font-bold">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContent.length > 0 ? (
                    recentContent.map((content) => (
                      <TableRow key={content.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-navy font-medium">{content.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 border-slate-200">
                            {content.type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={content.status === 'PUBLISHED' ? 'default' : 'secondary'}
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-tight shadow-none",
                              content.status === 'PUBLISHED' 
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                                : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                            )}
                          >
                            {content.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(content.updatedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                        No recent content found
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
