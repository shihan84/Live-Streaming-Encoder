'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  HelpCircle,
  Cloud,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="aws-header-gradient border-b border-gray-700/50 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{title || 'MediaLive Encoder'}</h1>
              {subtitle && (
                <p className="text-sm text-orange-400">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search channels, inputs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[300px] rounded-md border border-gray-600 bg-gray-800/80 backdrop-blur px-10 py-2 text-sm text-white placeholder:text-gray-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              />
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full aws-status-online aws-pulse"></div>
                <span className="text-sm font-medium text-white">System Healthy</span>
              </div>
              <Badge variant="outline" className="gap-1 border-orange-500/30 bg-orange-500/10 text-orange-400">
                <Activity className="h-3 w-3" />
                3 Active
              </Badge>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative hover:text-orange-500">
                <Bell className="h-5 w-5 text-gray-300" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 border-orange-500"
                >
                  2
                </Badge>
              </Button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:text-orange-500">
                <HelpCircle className="h-5 w-5 text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-orange-500">
                <Settings className="h-5 w-5 text-gray-300" />
              </Button>
              <div className="flex items-center gap-2 border-l border-orange-500/30 pl-2">
                <div className="h-8 w-8 rounded-full aws-gradient flex items-center justify-center aws-glow">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">Admin User</div>
                  <div className="text-xs text-orange-400">admin@company.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-orange-400">/</span>
          )}
          {item.href ? (
            <a 
              href={item.href} 
              className="hover:text-orange-400 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}