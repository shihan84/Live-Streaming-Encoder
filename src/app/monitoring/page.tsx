'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Header } from '@/components/layout/header'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Users,
  Database,
  Server,
  Monitor,
  Radio,
  Film,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react'

export default function MonitoringPage() {
  const breadcrumbItems = [
    { label: 'Monitoring' }
  ]

  // Mock data for demonstration
  const systemMetrics = {
    cpu: {
      usage: 45,
      temperature: 65,
      cores: 8,
      frequency: 3.2
    },
    memory: {
      usage: 62,
      total: 32,
      available: 12.2,
      used: 19.8
    },
    disk: {
      usage: 78,
      total: 1000,
      available: 220,
      used: 780,
      readSpeed: 45,
      writeSpeed: 32
    },
    network: {
      download: 125,
      upload: 85,
      latency: 12,
      packetLoss: 0.1
    }
  }

  const channelHealth = [
    {
      id: 'CH-001',
      name: 'Live Event Stream',
      status: 'healthy',
      viewers: 1250,
      bitrate: 5000,
      latency: 45,
      packetLoss: 0.1,
      uptime: '2h 15m'
    },
    {
      id: 'CH-002',
      name: '24/7 News Channel',
      status: 'healthy',
      viewers: 3420,
      bitrate: 2500,
      latency: 23,
      packetLoss: 0.0,
      uptime: '5d 8h'
    },
    {
      id: 'CH-003',
      name: 'Sports Broadcast',
      status: 'warning',
      viewers: 890,
      bitrate: 12000,
      latency: 89,
      packetLoss: 0.3,
      uptime: '45m'
    }
  ]

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High latency detected on Channel-003',
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

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="System Monitoring" 
            subtitle="Monitor system health, channel status, and performance metrics"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="channels">Channel Health</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                      <p className="text-2xl font-bold">{systemMetrics.cpu.usage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {systemMetrics.cpu.cores} cores @ {systemMetrics.cpu.frequency}GHz
                      </p>
                    </div>
                    <Cpu className="h-8 w-8 text-blue-600" />
                  </div>
                  <Progress value={systemMetrics.cpu.usage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                      <p className="text-2xl font-bold">{systemMetrics.memory.usage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB
                      </p>
                    </div>
                    <Database className="h-8 w-8 text-purple-600" />
                  </div>
                  <Progress value={systemMetrics.memory.usage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Disk Usage</p>
                      <p className="text-2xl font-bold">{systemMetrics.disk.usage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB
                      </p>
                    </div>
                    <HardDrive className="h-8 w-8 text-orange-600" />
                  </div>
                  <Progress value={systemMetrics.disk.usage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Network</p>
                      <p className="text-2xl font-bold">
                        {systemMetrics.network.download}↓/{systemMetrics.network.upload}↑
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {systemMetrics.network.latency}ms latency
                      </p>
                    </div>
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Channel Health Overview
                </CardTitle>
                <CardDescription>
                  Real-time health status of all active channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {channelHealth.map((channel) => (
                    <Card key={channel.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{channel.name}</h3>
                            <p className="text-sm text-muted-foreground">{channel.id}</p>
                          </div>
                          {getHealthIcon(channel.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Viewers</span>
                            <span>{channel.viewers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Bitrate</span>
                            <span>{channel.bitrate} Kbps</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Latency</span>
                            <span className={channel.latency > 50 ? 'text-yellow-600' : 'text-green-600'}>
                              {channel.latency}ms
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Packet Loss</span>
                            <span className={channel.packetLoss > 0.2 ? 'text-red-600' : 'text-green-600'}>
                              {channel.packetLoss}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Uptime</span>
                            <span>{channel.uptime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`mt-0.5 ${
                        alert.type === 'warning' ? 'text-yellow-600' :
                        alert.type === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                         alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </p>
                      </div>
                      {alert.resolved && (
                        <Badge variant="outline" className="text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPU Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    CPU Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{systemMetrics.cpu.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpu.usage} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cores</p>
                      <p className="font-medium">{systemMetrics.cpu.cores}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-medium">{systemMetrics.cpu.frequency} GHz</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-medium">{systemMetrics.cpu.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Load Average</p>
                      <p className="font-medium">2.45</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Memory Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Memory Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{systemMetrics.memory.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.memory.usage} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">{systemMetrics.memory.total} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Used</p>
                      <p className="font-medium">{systemMetrics.memory.used} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{systemMetrics.memory.available} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cached</p>
                      <p className="font-medium">4.2 GB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disk Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Disk Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{systemMetrics.disk.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.disk.usage} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">{systemMetrics.disk.total} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Used</p>
                      <p className="font-medium">{systemMetrics.disk.used} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{systemMetrics.disk.available} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IOPS</p>
                      <p className="font-medium">1,250</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Read Speed</p>
                      <p className="font-medium">{systemMetrics.disk.readSpeed} MB/s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Write Speed</p>
                      <p className="font-medium">{systemMetrics.disk.writeSpeed} MB/s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Network Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Download</p>
                      <p className="font-medium">{systemMetrics.network.download} Mbps</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Upload</p>
                      <p className="font-medium">{systemMetrics.network.upload} Mbps</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-medium">{systemMetrics.network.latency} ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Packet Loss</p>
                      <p className="font-medium">{systemMetrics.network.packetLoss}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Connections</p>
                      <p className="font-medium">1,247</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bandwidth</p>
                      <p className="font-medium">210 Mbps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Health Details</CardTitle>
                <CardDescription>
                  Detailed health metrics for all streaming channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelHealth.map((channel) => (
                    <Card key={channel.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold">{channel.name}</h3>
                              <p className="text-sm text-muted-foreground">{channel.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getHealthIcon(channel.status)}
                              <Badge 
                                variant={channel.status === 'healthy' ? 'default' : 'secondary'}
                                className={channel.status === 'warning' ? 'bg-yellow-500' : ''}
                              >
                                {channel.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{channel.viewers.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Viewers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{channel.bitrate}</p>
                            <p className="text-sm text-muted-foreground">Kbps</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{channel.latency}ms</p>
                            <p className="text-sm text-muted-foreground">Latency</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{channel.packetLoss}%</p>
                            <p className="text-sm text-muted-foreground">Packet Loss</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Uptime: {channel.uptime}</span>
                            <span>Last updated: 2 minutes ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>
                    Alerts that require attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAlerts.filter(alert => !alert.resolved).map((alert) => (
                      <Alert key={alert.id} className="border-l-4 border-l-yellow-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Acknowledge
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resolved Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Resolved Alerts</CardTitle>
                  <CardDescription>
                    Recently resolved alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAlerts.filter(alert => alert.resolved).map((alert) => (
                      <Alert key={alert.id} className="border-l-4 border-l-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Resolved
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}