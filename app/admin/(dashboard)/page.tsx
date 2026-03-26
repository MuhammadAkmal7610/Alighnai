"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, FileText, Users, Eye, TrendingUp, Calendar, Home, Grid3x3, Settings, Menu, MessageSquare, Phone, Activity } from 'lucide-react'
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
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/cms/stats'),
        fetch('/api/cms/activity?take=8')
      ])
      
      let statsData = { 
        totalContents: 0, 
        publishedContents: 0, 
        draftContents: 0, 
        totalPages: 0, 
        publishedPages: 0, 
        draftPages: 0,
        totalCategories: 0, 
        totalUsers: 0 
      }
      let activityData = { activity: [] }

      if (statsRes.ok) {
        statsData = await statsRes.json()
      } else {
        const err = await statsRes.json().catch(() => ({}))
        console.error('CMS: Failed to fetch stats:', err.details || statsRes.status)
      }

      if (activityRes.ok) {
        activityData = await activityRes.json()
      } else {
        const err = await activityRes.json().catch(() => ({}))
        console.error('CMS: Failed to fetch recent activity:', err.details || activityRes.status)
      }
      
      setStats(statsData)
      setRecentContent(activityData.activity || [])
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
            <div className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 w-max">
              <div className="h-1.5 w-1.5 rounded-full bg-mid-blue animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Double-click item to edit</span>
            </div>
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
                <div className="text-3xl font-bold text-navy">{stats.totalContents + stats.totalPages}</div>
                <p className="text-xs text-slate-400 mt-1">Total pages & posts</p>
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
                <div className="text-3xl font-bold text-navy">{stats.publishedContents + stats.publishedPages}</div>
                <p className="text-xs text-slate-400 mt-1">Live pages & posts</p>
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
                <div className="text-3xl font-bold text-navy">{stats.draftContents + (stats.totalPages - stats.publishedPages)}</div>
                <p className="text-xs text-slate-400 mt-1">Draft items</p>
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

          {/* Chat Board Section */}
          {/* <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-100 to-indigo-100">
              <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Team Communication Hub
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Live Chat</span>
                </div>
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  12 Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Real-time Team Chat</h3>
                    <p className="text-blue-700">Connect instantly with your team members</p>
                  </div>
                  <Button 
                    onClick={() => window.open('/admin/chat', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    size="lg"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Chat Board
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Voice & Video Calls</h4>
                    <p className="text-sm text-blue-700">HD quality calls with screen sharing</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Activity Tracking</h4>
                    <p className="text-sm text-blue-700">See who's online and typing</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Team Directory</h4>
                    <p className="text-sm text-blue-700">View all team members</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        <strong>Quick Access:</strong> Click "Open Chat Board" to start collaborating with your team in real-time.
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Server running on port 3003 • WebSocket enabled • CORS configured
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

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
                      <TableRow 
                        key={content.id} 
                        className="border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        onDoubleClick={() => {
                          const route =
                            content.type === 'PAGE'
                              ? `/admin/pages/${content.id}/edit`
                              : `/admin/content`
                          window.location.href = route
                        }}
                      >
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
