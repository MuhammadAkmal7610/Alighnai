"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, FileText, Grid3x3, Info, Settings, Users, LogOut, MessageSquare } from 'lucide-react'

const navigation = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Content',
    href: '/content',
    icon: FileText,
  },
  {
    title: 'Pages',
    href: '/pages',
    icon: Grid3x3,
  },
  /* {
    title: 'Categories',
    href: '/categories',
    icon: Menu,
  },
  {
    title: 'Info',
    href: '/info',
    icon: Info,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Chat',
    href: '/chat',
    icon: MessageSquare,
  }, */
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavItem = ({ item, level = 0 }: { item: any; level?: number }) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0

    return (
      <div>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            level === 0 && 'h-11',
            isActive
              ? 'bg-slate-100 text-navy shadow-sm border border-slate-200'
              : 'text-slate-600 hover:bg-slate-50 hover:text-navy',
            level === 1 && 'ml-6 h-9'
          )}
        >
          {item.icon && <item.icon className={cn("h-4 w-4", isActive ? "text-mid-blue" : "text-slate-400")} />}
          {item.title}
        </Link>
        {hasChildren && (
          <div className="ml-6 mt-1 space-y-1 border-l border-slate-100 pl-2">
            {item.children.map((child: any, index: number) => (
              <NavItem key={index} item={child} level={1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-navy flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-navy">AlignAI</h1>
            <p className="text-xs text-slate-500 font-medium">CMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {navigation.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
            <span className="text-xs text-slate-700 font-semibold">
              A
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">
              Admin User
            </p>
            <p className="text-xs text-slate-500 truncate">
              admin@alignai.com
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start text-slate-600 hover:text-navy hover:bg-white hover:shadow-sm"
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
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white border-slate-200 shadow-sm">
            <Menu className="h-6 w-6 text-navy" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white border-r border-slate-100">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  )
}
