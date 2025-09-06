'use client'

import { MainLayout } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Breadcrumb } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  Square, 
  Settings, 
  Plus, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Users,
  Zap,
  Film,
  Radio,
  Monitor,
  Calendar,
  Database,
  Cloud
} from 'lucide-react'

export default function Home() {
  const breadcrumbItems = [
    { label: 'Dashboard' }
  ]

  // Mock data for demonstration
  const systemHealth = {
    status: 'healthy',
    uptime: '15d 4h 32m',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    activeChannels: 3,
    totalChannels: 5
  }

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High latency detected on Channel-001',
      timestamp: '2 minutes ago',
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      message: 'Scheduled maintenance window starting in 1 hour',
      timestamp: '15 minutes ago',
      resolved: false
    },
    {
      id: 3,
      type: 'success',
      message: 'Channel-003 encoding completed successfully',
      timestamp: '1 hour ago',
      resolved: true
    }
  ]

  const activeChannels = [
    {
      id: 'CH-001',
      name: 'Live Event Stream',
      status: 'running',
      input: 'RTMP Primary',
      output: 'HLS Multi-bitrate',
      viewers: 1250,
      bitrate: '5000 Kbps',
      uptime: '2h 15m'
    },
    {
      id: 'CH-002',
      name: '24/7 News Channel',
      status: 'running',
      input: 'SRT Backup',
      output: 'RTMP + HLS',
      viewers: 3420,
      bitrate: '2500 Kbps',
      uptime: '5d 8h'
    },
    {
      id: 'CH-003',
      name: 'Sports Broadcast',
      status: 'running',
      input: 'NDI Source',
      output: '4K HLS',
      viewers: 890,
      bitrate: '12000 Kbps',
      uptime: '45m'
    }
  ]

  const quickStats = [
    {
      title: 'Active Channels',
      value: '3',
      change: '+1',
      icon: Radio,
      color: 'text-blue-600'
    },
    {
      title: 'Total Viewers',
      value: '5.6K',
      change: '+12%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Data Processed',
      value: '2.4 TB',
      change: '+8%',
      icon: Database,
      color: 'text-purple-600'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
      color: 'text-emerald-600'
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Dashboard" 
            subtitle="Monitor and manage your live streaming channels"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="aws-metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
                    <p className="text-xs text-green-400 truncate">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} flex-shrink-0 ml-2`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <Card className="lg:col-span-2 aws-channel-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription className="text-gray-400">
                Overall system status and resource utilization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">CPU Usage</span>
                    <span className="text-white font-medium">{systemHealth.cpuUsage}%</span>
                  </div>
                  <Progress value={systemHealth.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Memory Usage</span>
                    <span className="text-white font-medium">{systemHealth.memoryUsage}%</span>
                  </div>
                  <Progress value={systemHealth.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Disk Usage</span>
                    <span className="text-white font-medium">{systemHealth.diskUsage}%</span>
                  </div>
                  <Progress value={systemHealth.diskUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Active Channels</span>
                    <span className="text-white font-medium">{systemHealth.activeChannels}/{systemHealth.totalChannels}</span>
                  </div>
                  <Progress 
                    value={(systemHealth.activeChannels / systemHealth.totalChannels) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-white">System Healthy</span>
                </div>
                <span className="text-sm text-gray-400">
                  Uptime: {systemHealth.uptime}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="aws-channel-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-700">
                  <div className={`mt-0.5 flex-shrink-0 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                     alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                     <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate" title={alert.message}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {alert.timestamp}
                    </p>
                  </div>
                  {alert.resolved && (
                    <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-400 flex-shrink-0">
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Active Channels */}
        <Card className="aws-channel-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Radio className="h-5 w-5" />
                  Active Channels
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Currently running live streaming channels
                </CardDescription>
              </div>
              <Button className="aws-button-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Channel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeChannels.map((channel) => (
                <div key={channel.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 border border-gray-700 rounded-lg">
                  {/* Left Section - Channel Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className={`h-2 w-2 rounded-full ${
                        channel.status === 'running' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate" title={channel.name}>{channel.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{channel.id}</p>
                    </div>
                  </div>
                  
                  {/* Middle Section - Technical Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full lg:w-auto">
                      <div className="flex items-center gap-1 min-w-0">
                        <Monitor className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate" title={channel.input}>{channel.input}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Film className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate" title={channel.output}>{channel.output}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Zap className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate">{channel.bitrate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Section - Stats and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    <div className="flex gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-sm font-medium text-white">{channel.viewers.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">viewers</div>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-sm font-medium text-white">{channel.uptime}</div>
                        <div className="text-xs text-gray-400">uptime</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="aws-channel-card">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                <Plus className="h-6 w-6" />
                <span className="text-sm">Create Channel</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                <Database className="h-6 w-6" />
                <span className="text-sm">View Logs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}