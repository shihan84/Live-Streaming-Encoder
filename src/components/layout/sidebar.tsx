'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Settings, 
  Users, 
  Monitor, 
  Calendar, 
  Shield, 
  Activity,
  Input,
  Output,
  Sliders,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Channels', href: '/channels', icon: Users },
  { name: 'Inputs', href: '/inputs', icon: Input },
  { name: 'Outputs', href: '/outputs', icon: Output },
  { name: 'Profiles', href: '/profiles', icon: Sliders },
  { name: 'Schedules', href: '/schedules', icon: Calendar },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <div className={cn(
      'aws-sidebar-gradient border-r border-gray-800 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Logo and Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-lg font-bold text-white">Live Encoder</h1>
                <p className="text-xs text-gray-400">Professional</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                variant={activeItem === item.name ? "default" : "ghost"}
                className={cn(
                  'w-full justify-start text-left transition-all duration-200',
                  activeItem === item.name 
                    ? 'aws-button-gradient text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800',
                  isCollapsed && 'justify-center px-2'
                )}
                onClick={() => setActiveItem(item.name)}
              >
                <Icon className={cn(
                  'h-4 w-4',
                  !isCollapsed && 'mr-3'
                )} />
                {!isCollapsed && (
                  <>
                    {item.name}
                    {item.name === 'Monitoring' && (
                      <Badge variant="secondary" className="ml-auto bg-green-600 text-white">
                        Live
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </nav>

        {/* System Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">System Status</span>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Online
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">CPU</span>
                  <span className="text-green-400">23%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Memory</span>
                  <span className="text-green-400">45%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Streams</span>
                  <span className="text-green-400">2 Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}