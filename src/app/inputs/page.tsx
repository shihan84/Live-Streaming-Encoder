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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Zap,
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
  RadioIcon,
  Video,
  Mic,
  Hdmi,
  SdCard
} from 'lucide-react'

export default function InputsPage() {
  const breadcrumbItems = [
    { label: 'Inputs' }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data for demonstration
  const inputs = [
    {
      id: 'IN-001',
      name: 'Primary RTMP Input',
      type: 'RTMP',
      status: 'active',
      url: 'rtmp://input.example.com/live/primary',
      port: 1935,
      application: 'live',
      streamKey: 'primary-stream-key',
      bitrate: '5000 Kbps',
      resolution: '1920x1080',
      fps: 30,
      audioChannels: 2,
      connected: true,
      backup: false,
      security: {
        enabled: true,
        whitelist: ['192.168.1.100', '10.0.0.50'],
        authentication: 'basic'
      },
      health: {
        latency: 45,
        packetLoss: 0.1,
        bitrate: 5000,
        uptime: '2h 15m'
      },
      createdAt: '2024-01-10T10:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z'
    },
    {
      id: 'IN-002',
      name: 'Backup SRT Input',
      type: 'SRT',
      status: 'standby',
      url: 'srt://input.example.com:4200',
      port: 4200,
      streamId: 'backup-stream',
      passphrase: 'secure-passphrase',
      bitrate: '0 Kbps',
      resolution: '0x0',
      fps: 0,
      audioChannels: 0,
      connected: false,
      backup: true,
      security: {
        enabled: true,
        encryption: 'aes-256',
        authentication: 'streamid'
      },
      health: {
        latency: 0,
        packetLoss: 0,
        bitrate: 0,
        uptime: '0m'
      },
      createdAt: '2024-01-10T10:00:00Z',
      lastUsed: '2024-01-14T16:00:00Z'
    },
    {
      id: 'IN-003',
      name: 'NDI Studio Camera',
      type: 'NDI',
      status: 'active',
      url: 'ndi://studio.local/Camera1',
      port: 5961,
      sourceName: 'Studio Camera 1',
      bitrate: '2500 Kbps',
      resolution: '1920x1080',
      fps: 60,
      audioChannels: 2,
      connected: true,
      backup: false,
      security: {
        enabled: false
      },
      health: {
        latency: 12,
        packetLoss: 0.0,
        bitrate: 2500,
        uptime: '45m'
      },
      createdAt: '2024-01-15T14:00:00Z',
      lastUsed: '2024-01-15T14:45:00Z'
    },
    {
      id: 'IN-004',
      name: 'UDP Video Source',
      type: 'UDP',
      status: 'error',
      url: 'udp://239.1.1.1:5004',
      port: 5004,
      multicast: true,
      bitrate: '0 Kbps',
      resolution: '0x0',
      fps: 0,
      audioChannels: 0,
      connected: false,
      backup: false,
      security: {
        enabled: false
      },
      health: {
        latency: 0,
        packetLoss: 0,
        bitrate: 0,
        uptime: '0m'
      },
      createdAt: '2024-01-12T09:00:00Z',
      lastUsed: '2024-01-15T13:00:00Z'
    },
    {
      id: 'IN-005',
      name: 'HDMI Capture Card',
      type: 'DeckLink',
      status: 'active',
      url: 'decklink://0',
      deviceIndex: 0,
      bitrate: '8000 Kbps',
      resolution: '3840x2160',
      fps: 30,
      audioChannels: 8,
      connected: true,
      backup: false,
      security: {
        enabled: false
      },
      health: {
        latency: 8,
        packetLoss: 0.0,
        bitrate: 8000,
        uptime: '1h 30m'
      },
      createdAt: '2024-01-08T12:00:00Z',
      lastUsed: '2024-01-15T14:20:00Z'
    }
  ]

  const filteredInputs = inputs.filter(input => {
    const matchesSearch = input.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         input.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || input.type === typeFilter
    const matchesStatus = statusFilter === 'all' || input.status === statusFilter
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
      case 'RTMP':
        return <Radio className="h-5 w-5" />
      case 'SRT':
        return <Shield className="h-5 w-5" />
      case 'NDI':
        return <Wifi className="h-5 w-5" />
      case 'UDP':
        return <Ethernet className="h-5 w-5" />
      case 'DeckLink':
        return <Hdmi className="h-5 w-5" />
      default:
        return <RadioIcon className="h-5 w-5" />
    }
  }

  const getHealthColor = (latency: number, packetLoss: number) => {
    if (latency > 100 || packetLoss > 1) return 'text-red-600'
    if (latency > 50 || packetLoss > 0.5) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Input Sources" 
            subtitle="Configure and manage your video input sources"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inputs</p>
                  <p className="text-2xl font-bold">{inputs.length}</p>
                </div>
                <Radio className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{inputs.filter(i => i.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bitrate</p>
                  <p className="text-2xl font-bold">
                    {(inputs.reduce((acc, input) => acc + parseInt(input.bitrate), 0) / 1000).toFixed(1)} Mbps
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold">{inputs.filter(i => i.status === 'error').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Input Sources</CardTitle>
                  <CardDescription>
                    Configure video and audio input sources for your channels
                  </CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Input
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Input Source</DialogTitle>
                      <DialogDescription>
                        Configure a new video input source with connection and security settings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inputName">Input Name</Label>
                          <Input id="inputName" placeholder="Primary RTMP Input" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inputType">Input Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select input type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rtmp">RTMP</SelectItem>
                              <SelectItem value="srt">SRT</SelectItem>
                              <SelectItem value="ndi">NDI</SelectItem>
                              <SelectItem value="udp">UDP</SelectItem>
                              <SelectItem value="decklink">DeckLink</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inputUrl">Input URL</Label>
                        <Input id="inputUrl" placeholder="rtmp://input.example.com/live/stream" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="port">Port</Label>
                          <Input id="port" type="number" placeholder="1935" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="application">Application/Stream ID</Label>
                          <Input id="application" placeholder="live" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamKey">Stream Key (if applicable)</Label>
                        <Input id="streamKey" type="password" placeholder="stream-key-here" />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="backup" />
                          <Label htmlFor="backup">Backup Input</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="security" />
                          <Label htmlFor="security">Enable Security</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                          Add Input
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
                      placeholder="Search inputs..."
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
                    <SelectItem value="RTMP">RTMP</SelectItem>
                    <SelectItem value="SRT">SRT</SelectItem>
                    <SelectItem value="NDI">NDI</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="DeckLink">DeckLink</SelectItem>
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
                {filteredInputs.map((input) => (
                  <Card key={input.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(input.type)}
                            <div>
                              <h3 className="font-semibold">{input.name}</h3>
                              <p className="text-sm text-muted-foreground">{input.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(input.status)}
                            {input.backup && (
                              <Badge variant="outline">Backup</Badge>
                            )}
                            {input.security.enabled && (
                              <Badge variant="outline">Secured</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{input.bitrate}</div>
                            <div className="text-xs text-muted-foreground">bitrate</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{input.resolution}</div>
                            <div className="text-xs text-muted-foreground">{input.fps} fps</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getHealthColor(input.health.latency, input.health.packetLoss)}`}>
                              {input.health.latency}ms
                            </div>
                            <div className="text-xs text-muted-foreground">latency</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Radio className="h-4 w-4" />
                              <span>Connection:</span>
                            </div>
                            <div className="font-medium">{input.url}</div>
                            <div className="text-xs text-muted-foreground">
                              Port: {input.port} | Audio: {input.audioChannels} channels
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Zap className="h-4 w-4" />
                              <span>Health:</span>
                            </div>
                            <div className="font-medium">
                              Packet Loss: {input.health.packetLoss}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Uptime: {input.health.uptime}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Shield className="h-4 w-4" />
                              <span>Security:</span>
                            </div>
                            <div className="font-medium">
                              {input.security.enabled ? 'Enabled' : 'Disabled'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {input.security.authentication && `Auth: ${input.security.authentication}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Health Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Health Monitor
              </CardTitle>
              <CardDescription>
                Real-time input source health metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inputs.filter(i => i.status === 'active').map((input) => (
                <div key={input.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{input.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {input.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Latency</span>
                      <span className={getHealthColor(input.health.latency, input.health.packetLoss)}>
                        {input.health.latency}ms
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((input.health.latency / 100) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Packet Loss</span>
                      <span className={getHealthColor(input.health.latency, input.health.packetLoss)}>
                        {input.health.packetLoss}%
                      </span>
                    </div>
                    <Progress 
                      value={input.health.packetLoss * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Bitrate</span>
                      <span>{input.health.bitrate} Kbps</span>
                    </div>
                    <Progress 
                      value={(input.health.bitrate / 10000) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span>Connected</span>
                      <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${
                          input.connected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span>{input.connected ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
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