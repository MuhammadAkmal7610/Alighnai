"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Globe, Lock, Bell, Database, Save, Server, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-navy tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure global platform preferences and system parameters</p>
        </div>
        <Button className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2 font-bold">
              <Globe className="h-5 w-5 text-mid-blue" />
              Site Configuration
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Global website identification and status</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-navy">Site Name</Label>
              <Input defaultValue="AlignAI" className="bg-white border-slate-200 text-navy h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-navy">Global Description (Meta Tag)</Label>
              <Input defaultValue="Enterprise AI Governance & Alignment" className="bg-white border-slate-200 text-navy h-11 rounded-lg" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-navy">Maintenance Mode</Label>
                <p className="text-xs text-slate-400">Take the site offline for updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2 font-bold">
              <Lock className="h-5 w-5 text-mid-blue" />
              Security & Access
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Authentication and platform protection</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-navy">Enforce MFA</Label>
                <p className="text-xs text-slate-400">Require multi-factor for all admins</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-navy">Public Registration</Label>
                <p className="text-xs text-slate-400">Allow new users to sign up</p>
              </div>
              <Switch checked={false} />
            </div>
            <Button variant="outline" className="w-full border-slate-200 text-navy font-bold h-11 hover:bg-slate-50">
              Rotate Management API Keys
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl lg:col-span-2">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2 font-bold">
              <Server className="h-5 w-5 text-mid-blue" />
              System Status & Environment
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Core platform technical specifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prisma Engine</p>
                <p className="text-xl font-bold text-navy font-mono">v7.5.0</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next.js Framework</p>
                <p className="text-xl font-bold text-navy font-mono">v15.3.0</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Infrastructure</p>
                <p className="text-xl font-bold text-navy font-mono">Node v20.x</p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-mid-blue" />
              <p className="text-xs text-mid-blue font-semibold">Your system is up to date and all services are operational.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
