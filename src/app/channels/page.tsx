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
  Search
} from 'lucide-react'

export default function ChannelsPage() {
  const breadcrumbItems = [
    { label: 'Channels' }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data for demonstration
  const channels = [
    {
      id: 'CH-001',
      name: 'Live Event Stream',
      description: 'Main live event streaming channel',
      status: 'running',
      inputType: 'RTMP',
      inputUrl: 'rtmp://input.example.com/live/event1',
      outputType: 'HLS Multi-bitrate',
      outputUrl: 'https://cdn.example.com/live/event1/master.m3u8',
      encodingProfile: 'High Quality 1080p',
      viewers: 1250,
      bitrate: '5000 Kbps',
      uptime: '2h 15m',
      scte35Enabled: true,
      backupInput: 'rtmp://backup.example.com/live/event1',
      cdnEnabled: true,
      createdAt: '2024-01-10T10:00:00Z',
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    {
      id: 'CH-002',
      name: '24/7 News Channel',
      description: 'Continuous news broadcasting',
      status: 'running',
      inputType: 'SRT',
      inputUrl: 'srt://input.example.com:4200/news',
      outputType: 'RTMP + HLS',
      outputUrl: 'https://cdn.example.com/live/news/master.m3u8',
      encodingProfile: 'Standard 720p',
      viewers: 3420,
      bitrate: '2500 Kbps',
      uptime: '5d 8h',
      scte35Enabled: true,
      backupInput: 'rtmp://backup.example.com/live/news',
      cdnEnabled: true,
      createdAt: '2024-01-05T08:00:00Z',
      lastUpdated: '2024-01-15T14:25:00Z'
    },
    {
      id: 'CH-003',
      name: 'Sports Broadcast',
      description: 'Live sports events coverage',
      status: 'running',
      inputType: 'NDI',
      inputUrl: 'ndi://sports.local/sports1',
      outputType: '4K HLS',
      outputUrl: 'https://cdn.example.com/live/sports/master.m3u8',
      encodingProfile: 'Ultra HD 4K',
      viewers: 890,
      bitrate: '12000 Kbps',
      uptime: '45m',
      scte35Enabled: false,
      backupInput: null,
      cdnEnabled: true,
      createdAt: '2024-01-15T14:00:00Z',
      lastUpdated: '2024-01-15T14:45:00Z'
    },
    {
      id: 'CH-004',
      name: 'Education Channel',
      description: 'Educational content streaming',
      status: 'stopped',
      inputType: 'RTMP',
      inputUrl: 'rtmp://input.example.com/live/edu',
      outputType: 'HLS',
      outputUrl: 'https://cdn.example.com/live/edu/master.m3u8',
      encodingProfile: 'Standard 720p',
      viewers: 0,
      bitrate: '0 Kbps',
      uptime: '0m',
      scte35Enabled: true,
      backupInput: 'rtmp://backup.example.com/live/edu',
      cdnEnabled: false,
      createdAt: '2024-01-08T12:00:00Z',
      lastUpdated: '2024-01-14T16:00:00Z'
    },
    {
      id: 'CH-005',
      name: 'Music Channel',
      description: '24/7 music video streaming',
      status: 'error',
      inputType: 'RTMP',
      inputUrl: 'rtmp://input.example.com/live/music',
      outputType: 'HLS',
      outputUrl: 'https://cdn.example.com/live/music/master.m3u8',
      encodingProfile: 'High Quality 1080p',
      viewers: 0,
      bitrate: '0 Kbps',
      uptime: '0m',
      scte35Enabled: false,
      backupInput: null,
      cdnEnabled: true,
      createdAt: '2024-01-12T09:00:00Z',
      lastUpdated: '2024-01-15T13:00:00Z'
    }
  ]

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || channel.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-500">Running</Badge>
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Channels" 
            subtitle="Manage and configure your live streaming channels"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Channels</p>
                  <p className="text-2xl font-bold">{channels.length}</p>
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
                  <p className="text-2xl font-bold">{channels.filter(c => c.status === 'running').length}</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Viewers</p>
                  <p className="text-2xl font-bold">
                    {channels.reduce((acc, channel) => acc + channel.viewers, 0).toLocaleString()}
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
                  <p className="text-2xl font-bold">{channels.filter(c => c.status === 'error').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Channel Management</CardTitle>
                <CardDescription>
                  Configure and manage your streaming channels
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Channel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Channel</DialogTitle>
                    <DialogDescription>
                      Configure a new live streaming channel with input and output settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="channelName">Channel Name</Label>
                        <Input id="channelName" placeholder="My Live Channel" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channelId">Channel ID</Label>
                        <Input id="channelId" placeholder="CH-001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Channel description..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="dash">DASH</SelectItem>
                            <SelectItem value="webrtc">WebRTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inputUrl">Input URL</Label>
                        <Input id="inputUrl" placeholder="rtmp://input.example.com/live/stream" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="outputUrl">Output URL</Label>
                        <Input id="outputUrl" placeholder="https://cdn.example.com/live/master.m3u8" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="encodingProfile">Encoding Profile</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profile" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="720p">Standard 720p</SelectItem>
                            <SelectItem value="1080p">High Quality 1080p</SelectItem>
                            <SelectItem value="4k">Ultra HD 4K</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupInput">Backup Input (Optional)</Label>
                        <Input id="backupInput" placeholder="rtmp://backup.example.com/live/stream" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="scte35" />
                        <Label htmlFor="scte35">Enable SCTE-35</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="cdn" />
                        <Label htmlFor="cdn">Enable CDN</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        Create Channel
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
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredChannels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(channel.status)}
                          <div>
                            <h3 className="font-semibold">{channel.name}</h3>
                            <p className="text-sm text-muted-foreground">{channel.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(channel.status)}
                          {channel.scte35Enabled && (
                            <Badge variant="outline">SCTE-35</Badge>
                          )}
                          {channel.cdnEnabled && (
                            <Badge variant="outline">CDN</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.viewers.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">viewers</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.bitrate}</div>
                          <div className="text-xs text-muted-foreground">bitrate</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.uptime}</div>
                          <div className="text-xs text-muted-foreground">uptime</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {channel.status === 'running' ? (
                            <Button variant="outline" size="sm">
                              <Square className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
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
                            <Monitor className="h-4 w-4" />
                            <span>Input:</span>
                          </div>
                          <div className="font-medium">{channel.inputType} - {channel.inputUrl}</div>
                          {channel.backupInput && (
                            <div className="text-xs text-muted-foreground">
                              Backup: {channel.backupInput}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Film className="h-4 w-4" />
                            <span>Output:</span>
                          </div>
                          <div className="font-medium">{channel.outputType}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {channel.outputUrl}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <span>Profile:</span>
                          </div>
                          <div className="font-medium">{channel.encodingProfile}</div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(channel.createdAt).toLocaleDateString()}
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
      </div>
    </MainLayout>
  )
}