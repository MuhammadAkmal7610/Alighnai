"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/cms/ModernSidebar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Globe, Lock, Bell, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-navy">
      <Sidebar>
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate">Manage your CMS preferences and configuration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan" />
                  Site Configuration
                </CardTitle>
                <CardDescription className="text-slate">General website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-light-slate">Site Name</Label>
                  <Input defaultValue="AlignAI" className="bg-navy border-mid-blue text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-light-slate">Site Description</Label>
                  <Input defaultValue="Enterprise AI Governance" className="bg-navy border-mid-blue text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-light-slate">Maintenance Mode</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-cyan" />
                  Security
                </CardTitle>
                <CardDescription className="text-slate">Authentication and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-light-slate">Enforce MFA</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-light-slate">Public Registration</Label>
                  <Switch checked={false} />
                </div>
                <Button variant="outline" className="w-full border-mid-blue text-white">
                  Reset API Keys
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-deep-blue border-mid-blue">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan" />
                  System
                </CardTitle>
                <CardDescription className="text-slate">Database and system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-light-slate">
                <div className="flex justify-between text-sm">
                  <span>Prisma Version</span>
                  <span className="text-cyan font-mono">5.22.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next.js Version</span>
                  <span className="text-cyan font-mono">15.0.3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Runtime</span>
                  <span className="text-cyan font-mono">Node.js 20.x</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button className="bg-cyan text-navy hover:bg-cyan/90">
              Save All Settings
            </Button>
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
