'use client'

import { ChatBoard } from '@/components/chat/ChatBoard'
import { MessageSquare, Users, Phone, Mail, Settings, Bell } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            CRM Chat Board
          </h1>
          <p className="text-muted-foreground">
            Real-time communication and collaboration platform for your team.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
            <Users className="h-4 w-4" />
            Team Members (4)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Phone className="h-4 w-4" />
            Start Call
          </button>
        </div>
      </div>

      {/* Chat Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Total Messages</h3>
          </div>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Active Users</h3>
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">Online now</p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Unread</h3>
          </div>
          <div className="text-2xl font-bold">8</div>
          <p className="text-sm text-muted-foreground">Messages</p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Calls Today</h3>
          </div>
          <div className="text-2xl font-bold">24</div>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Chat Board */}
      <div className="bg-white rounded-lg border overflow-hidden" style={{ height: '600px' }}>
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-navy">
            <MessageSquare className="h-5 w-5" />
            Live Chat
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected to chat server</span>
            </div>
            <div className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Notifications enabled</span>
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100%-73px)]">
          <ChatBoard />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4 text-navy">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left bg-white">
            <Settings className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <h3 className="font-medium text-center">Chat Settings</h3>
            <p className="text-sm text-gray-600 text-center">Configure notifications and preferences</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left bg-white">
            <Mail className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <h3 className="font-medium text-center">Email History</h3>
            <p className="text-sm text-gray-600 text-center">View all chat transcripts</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left bg-white">
            <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <h3 className="font-medium text-center">Team Directory</h3>
            <p className="text-sm text-gray-600 text-center">Manage team members and roles</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4 text-navy">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Sarah Johnson</div>
              <div className="text-sm text-gray-600">Updated project proposal</div>
              <div className="text-xs text-gray-400">2 hours ago</div>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">New</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Mike Chen</div>
              <div className="text-sm text-gray-600">Completed client call</div>
              <div className="text-xs text-gray-400">3 hours ago</div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Completed</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Emily Davis</div>
              <div className="text-sm text-gray-600">Joined team meeting</div>
              <div className="text-xs text-gray-400">5 hours ago</div>
            </div>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Meeting</span>
          </div>
        </div>
      </div>
    </div>
  )
}
