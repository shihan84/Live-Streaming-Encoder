'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  Settings, 
  Monitor, 
  Calendar, 
  Shield, 
  BarChart3, 
  Bell, 
  Database,
  Users,
  Zap,
  Film,
  Radio,
  Cloud,
  Lock,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Channels',
    href: '/channels',
    icon: Radio,
    badge: '3',
  },
  {
    title: 'Inputs',
    href: '/inputs',
    icon: Radio,
  },
  {
    title: 'Outputs',
    href: '/outputs',
    icon: Monitor,
  },
  {
    title: 'Encoding Profiles',
    href: '/profiles',
    icon: Film,
  },
  {
    title: 'Event Schedules',
    href: '/schedules',
    icon: Calendar,
  },
  {
    title: 'Monitoring',
    href: '/monitoring',
    icon: BarChart3,
    children: [
      {
        title: 'System Metrics',
        href: '/monitoring/metrics',
        icon: Activity,
      },
      {
        title: 'Channel Health',
        href: '/monitoring/health',
        icon: Monitor,
      },
      {
        title: 'Alerts',
        href: '/monitoring/alerts',
        icon: AlertTriangle,
        badge: '2',
      },
    ],
  },
  {
    title: 'Security',
    href: '/security',
    icon: Shield,
    children: [
      {
        title: 'Access Control',
        href: '/security/access',
        icon: Users,
      },
      {
        title: 'API Keys',
        href: '/security/api-keys',
        icon: Lock,
      },
      {
        title: 'Audit Logs',
        href: '/security/audit',
        icon: Database,
      },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      {
        title: 'General',
        href: '/settings/general',
        icon: Settings,
      },
      {
        title: 'Encoding',
        href: '/settings/encoding',
        icon: Film,
      },
      {
        title: 'Network',
        href: '/settings/network',
        icon: Cloud,
      },
      {
        title: 'Storage',
        href: '/settings/storage',
        icon: Database,
      },
    ],
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const isActive = item.href === pathname
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)

    if (hasChildren) {
      return (
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between font-normal h-auto p-3 hover:bg-transparent aws-sidebar-item',
              isActive && 'bg-transparent aws-sidebar-item.active font-medium',
              level > 0 && 'pl-6'
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-orange-400" />
              <span className="text-gray-300">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {item.badge}
                </Badge>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </Button>
          {isExpanded && (
            <div className="ml-4">
              {item.children.map((child) => (
                <NavItemComponent key={child.title} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link href={item.href || '#'}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start font-normal h-auto p-3 hover:bg-transparent aws-sidebar-item',
            isActive && 'bg-transparent aws-sidebar-item.active font-medium',
            level > 0 && 'pl-6'
          )}
        >
          <item.icon className="h-4 w-4 mr-3 text-orange-400" />
          <span className="text-gray-300">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500/30">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <div className={cn('pb-12 w-64 aws-sidebar-gradient aws-scrollbar', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 mb-6 p-3">
            <div className="w-10 h-10 aws-gradient rounded-lg flex items-center justify-center aws-glow">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MediaLive</h2>
              <p className="text-xs text-orange-400">Live Streaming Encoder</p>
            </div>
          </div>
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavItemComponent key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen aws-gradient-dark">
      <div className="w-64 border-r border-gray-800">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto bg-gray-900">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}