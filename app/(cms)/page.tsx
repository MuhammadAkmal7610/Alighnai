"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, FileText, Users, Eye, TrendingUp, Calendar, Home, Grid3x3, Settings, Menu } from 'lucide-react'
import { Sidebar } from '@/components/cms/ModernSidebar'

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

      try {
        if (statsRes.ok) statsData = await statsRes.json()
      } catch (e) { console.error('Stats parse error', e) }

      try {
        if (contentRes.ok) contentData = await contentRes.json()
      } catch (e) { console.error('Content parse error', e) }
      
      setStats(statsData)
      setRecentContent(contentData.posts || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-light-slate">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate">Welcome to your AlignAI CMS</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-light-slate">Total Content</CardTitle>
                <FileText className="h-4 w-4 text-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalContents}</div>
                <p className="text-xs text-slate">All content items</p>
              </CardContent>
            </Card>

            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-light-slate">Published</CardTitle>
                <Eye className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.publishedContents}</div>
                <p className="text-xs text-slate">Live content</p>
              </CardContent>
            </Card>

            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-light-slate">Drafts</CardTitle>
                <FileText className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.draftContents}</div>
                <p className="text-xs text-slate">Draft content</p>
              </CardContent>
            </Card>

            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-light-slate">Categories</CardTitle>
                <Menu className="h-4 w-4 text-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalCategories}</div>
                <p className="text-xs text-slate">Content categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Content */}
          <Card className="bg-deep-blue border-mid-blue">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate">Title</TableHead>
                    <TableHead className="text-slate">Type</TableHead>
                    <TableHead className="text-slate">Status</TableHead>
                    <TableHead className="text-slate">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContent.map((content) => (
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
                      <TableCell className="text-slate">
                        {new Date(content.updatedAt).toLocaleDateString()}
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
