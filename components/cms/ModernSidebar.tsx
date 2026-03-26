"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, FileText, Grid3x3, Settings, Users, LogOut } from 'lucide-react'

const navOverview = [
  { title: 'Dashboard', href: '/admin', icon: Home },
  { title: 'Content', href: '/admin/content', icon: FileText },
  { title: 'Pages', href: '/admin/pages', icon: Grid3x3 },
]

const navManage = [
  // { title: 'Categories', href: '/admin/categories', icon: FolderTree },
  // { title: 'Info', href: '/admin/info', icon: Info },
  { title: 'Users', href: '/admin/users', icon: Users },
  // { title: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
]

function navItemActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === '/admin') {
    return pathname === '/admin' || pathname === '/admin/'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  
  const isFullBleedChrome =
    pathname?.includes('/edit') || pathname?.startsWith('/admin/preview')

  if (isFullBleedChrome) {
    return <>{children}</>
  }

  const user = session?.user
  const initial =
    (user?.name?.[0] || user?.email?.[0] || '?').toUpperCase()

  const NavItem = ({
    item,
    level = 0,
    onNavigate,
  }: {
    item: any
    level?: number
    onNavigate?: () => void
  }) => {
    const isActive = navItemActive(pathname, item.href)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div>
        <Link
          href={item.href}
          onClick={() => onNavigate?.()}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            level === 0 && 'min-h-[44px]',
            isActive
              ? 'bg-slate-100 text-navy shadow-sm border border-slate-200'
              : 'text-slate-600 hover:bg-slate-50 hover:text-navy',
            level === 1 && 'ml-6 min-h-9'
          )}
        >
          {item.icon && <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-mid-blue" : "text-slate-400")} />}
          <span className="truncate">{item.title}</span>
        </Link>
        {hasChildren && (
          <div className="ml-6 mt-1 space-y-1 border-l border-slate-100 pl-2">
            {item.children.map((child: any, index: number) => (
              <NavItem key={index} item={child} level={1} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
            <img src="/brand/logo-bg-white.png" alt="AlignAI" className="h-14 w-auto" />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-6">
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Overview
            </p>
            <div className="space-y-1">
              {navOverview.map((item, index) => (
                <NavItem key={index} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Manage
            </p>
            <div className="space-y-1">
              {navManage.map((item, index) => (
                <NavItem key={index} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
            <span className="text-xs text-slate-700 font-semibold">
              {initial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">
              {user?.name || 'Signed in'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || '—'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start text-slate-600 hover:text-navy hover:bg-white hover:shadow-sm"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Toggle */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 border-slate-200 bg-white shadow-sm md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-navy" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white border-r border-slate-100">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area — top padding clears fixed mobile menu button */}
      <main className="min-w-0 flex-1 overflow-auto bg-slate-50 pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-0">
        {children}
      </main>
    </div>
  )
}
