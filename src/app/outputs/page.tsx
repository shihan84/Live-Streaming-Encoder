'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Breadcrumb } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Play, 
  Square, 
  Settings, 
  Edit, 
  Trash2, 
  Copy, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Film,
  Radio,
  Monitor,
  Calendar,
  Database,
  Cloud,
  Filter,
  Search,
  Shield,
  Wifi,
  Ethernet,
  Satellite,
  Hdmi,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Activity
} from 'lucide-react'

export default function OutputsPage() {
  const breadcrumbItems = [
    { label: 'Outputs' }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data for demonstration
  const outputs = [
    {
      id: 'OUT-001',
      name: 'Primary HLS Output',
      type: 'HLS',
      status: 'active',
      url: 'https://cdn.example.com/live/primary/master.m3u8',
      protocol: 'HTTPS',
      port: 443,
      cdnProvider: 'Cloudflare',
      bitrate: '5000 Kbps',
      resolution: '1920x1080',
      viewers: 1250,
      uptime: '2h 15m',
      segmentDuration: 6,
      playlistSize: 5,
      encryption: {
        enabled: true,
        type: 'AES-128',
        keyRotation: 'manual'
      },
      redundancy: {
        enabled: true,
        backupUrl: 'https://backup-cdn.example.com/live/primary/master.m3u8'
      },
      createdAt: '2024-01-10T10:00:00Z',
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    {
      id: 'OUT-002',
      name: 'Backup RTMP Output',
      type: 'RTMP',
      status: 'standby',
      url: 'rtmp://backup.example.com/live/stream',
      protocol: 'RTMP',
      port: 1935,
      cdnProvider: 'None',
      bitrate: '0 Kbps',
      resolution: '0x0',
      viewers: 0,
      uptime: '0m',
      segmentDuration: 0,
      playlistSize: 0,
      encryption: {
        enabled: false
      },
      redundancy: {
        enabled: false
      },
      createdAt: '2024-01-10T10:00:00Z',
      lastUpdated: '2024-01-14T16:00:00Z'
    },
    {
      id: 'OUT-003',
      name: '4K UHD Output',
      type: 'HLS',
      status: 'active',
      url: 'https://cdn.example.com/live/4k/master.m3u8',
      protocol: 'HTTPS',
      port: 443,
      cdnProvider: 'AWS CloudFront',
      bitrate: '12000 Kbps',
      resolution: '3840x2160',
      viewers: 890,
      uptime: '45m',
      segmentDuration: 6,
      playlistSize: 3,
      encryption: {
        enabled: true,
        type: 'DRM',
        keyRotation: 'automatic'
      },
      redundancy: {
        enabled: true,
        backupUrl: 'https://backup-cdn.example.com/live/4k/master.m3u8'
      },
      createdAt: '2024-01-15T14:00:00Z',
      lastUpdated: '2024-01-15T14:45:00Z'
    },
    {
      id: 'OUT-004',
      name: 'Low Latency WebRTC',
      type: 'WebRTC',
      status: 'active',
      url: 'wss://stream.example.com/live/low-latency',
      protocol: 'WSS',
      port: 443,
      cdnProvider: 'Custom',
      bitrate: '2500 Kbps',
      resolution: '1280x720',
      viewers: 3420,
      uptime: '1h 30m',
      segmentDuration: 1,
      playlistSize: 0,
      encryption: {
        enabled: true,
        type: 'DTLS'
      },
      redundancy: {
        enabled: false
      },
      createdAt: '2024-01-12T09:00:00Z',
      lastUpdated: '2024-01-15T14:20:00Z'
    },
    {
      id: 'OUT-005',
      name: 'DASH Adaptive',
      type: 'DASH',
      status: 'error',
      url: 'https://cdn.example.com/live/dash/manifest.mpd',
      protocol: 'HTTPS',
      port: 443,
      cdnProvider: 'Akamai',
      bitrate: '0 Kbps',
      resolution: '0x0',
      viewers: 0,
      uptime: '0m',
      segmentDuration: 2,
      playlistSize: 0,
      encryption: {
        enabled: false
      },
      redundancy: {
        enabled: false
      },
      createdAt: '2024-01-08T12:00:00Z',
      lastUpdated: '2024-01-15T13:00:00Z'
    }
  ]

  const filteredOutputs = outputs.filter(output => {
    const matchesSearch = output.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         output.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || output.type === typeFilter
    const matchesStatus = statusFilter === 'all' || output.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'standby':
        return <Badge className="bg-yellow-500">Standby</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HLS':
        return <Film className="h-5 w-5" />
      case 'RTMP':
        return <Radio className="h-5 w-5" />
      case 'WebRTC':
        return <Wifi className="h-5 w-5" />
      case 'DASH':
        return <Monitor className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'HTTPS':
        return <Shield className="h-4 w-4" />
      case 'RTMP':
        return <Radio className="h-4 w-4" />
      case 'WSS':
        return <Wifi className="h-4 w-4" />
      default:
        return <Ethernet className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Output Destinations" 
            subtitle="Configure and manage your streaming output destinations"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Outputs</p>
                  <p className="text-2xl font-bold">{outputs.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{outputs.filter(o => o.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Viewers</p>
                  <p className="text-2xl font-bold">
                    {outputs.reduce((acc, output) => acc + output.viewers, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold">{outputs.filter(o => o.status === 'error').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Output List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output Destinations</CardTitle>
                  <CardDescription>
                    Configure video and audio output destinations for your streams
                  </CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Output
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Output Destination</DialogTitle>
                      <DialogDescription>
                        Configure a new output destination with protocol and CDN settings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="outputName">Output Name</Label>
                          <Input id="outputName" placeholder="Primary HLS Output" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="outputType">Output Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select output type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hls">HLS</SelectItem>
                              <SelectItem value="rtmp">RTMP</SelectItem>
                              <SelectItem value="webrtc">WebRTC</SelectItem>
                              <SelectItem value="dash">DASH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="outputUrl">Output URL</Label>
                        <Input id="outputUrl" placeholder="https://cdn.example.com/live/master.m3u8" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="protocol">Protocol</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="https">HTTPS</SelectItem>
                              <SelectItem value="rtmp">RTMP</SelectItem>
                              <SelectItem value="wss">WSS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">Port</Label>
                          <Input id="port" type="number" placeholder="443" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cdnProvider">CDN Provider</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select CDN" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cloudflare">Cloudflare</SelectItem>
                              <SelectItem value="aws">AWS CloudFront</SelectItem>
                              <SelectItem value="akamai">Akamai</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backupUrl">Backup URL (Optional)</Label>
                          <Input id="backupUrl" placeholder="https://backup.example.com/live/master.m3u8" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="encryption" />
                          <Label htmlFor="encryption">Enable Encryption</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="redundancy" />
                          <Label htmlFor="redundancy">Enable Redundancy</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                          Add Output
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search outputs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="HLS">HLS</SelectItem>
                    <SelectItem value="RTMP">RTMP</SelectItem>
                    <SelectItem value="WebRTC">WebRTC</SelectItem>
                    <SelectItem value="DASH">DASH</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="standby">Standby</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredOutputs.map((output) => (
                  <Card key={output.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(output.type)}
                            <div>
                              <h3 className="font-semibold">{output.name}</h3>
                              <p className="text-sm text-muted-foreground">{output.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              {getProtocolIcon(output.protocol)}
                              <span>{output.protocol}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Server className="h-4 w-4 text-muted-foreground" />
                              <span>{output.cdnProvider}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4 text-muted-foreground" />
                              <span>{output.bitrate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{output.viewers.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">viewers</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{output.uptime}</div>
                            <div className="text-xs text-muted-foreground">uptime</div>
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
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span className="input-url">{output.url}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{output.resolution}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              <span>Port {output.port}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(output.status)}
                            {output.encryption.enabled && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Encrypted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Output Details */}
          <Card>
            <CardHeader>
              <CardTitle>Output Health</CardTitle>
              <CardDescription>
                Real-time monitoring of output destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredOutputs.slice(0, 3).map((output) => (
                <div key={output.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(output.type)}
                      <span className="font-medium text-sm">{output.name}</span>
                    </div>
                    {getStatusBadge(output.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Bandwidth</span>
                      <span>{output.bitrate}</span>
                    </div>
                    <Progress 
                      value={output.status === 'active' ? 85 : 0} 
                      className="h-1" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                    <span>Viewers: {output.viewers.toLocaleString()}</span>
                    <span>Uptime: {output.uptime}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}