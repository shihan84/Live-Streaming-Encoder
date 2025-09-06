'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Cloud,
  Filter,
  Search,
  Edit,
  Trash2,
  Copy,
  HardDrive,
  MonitorSpeaker,
  Sliders,
  Shield
} from 'lucide-react'

interface Stream {
  id: string
  name: string
  inputUrl: string
  outputUrl: string
  status: 'idle' | 'encoding' | 'error' | 'running' | 'stopped'
  bitrate: number
  resolution: string
  scte35Enabled: boolean
  encoderPreset: string
  gopSize: number
  bFrames: number
  profile: string
  chroma: string
  aspectRatio: string
  keyframeInterval: number
  pcr: string
  audioCodec: string
  audioBitrate: number
  audioLKFS: number
  audioSampleRate: number
  scte35Pid: number
  nullPid: number
  latency: number
  
  // SRT-specific fields
  srtLatency?: number
  srtBandwidthOverhead?: number
  srtPassphrase?: string
  srtStreamId?: string
  
  // Metadata fields
  description?: string
  genre?: string
  language?: string
  provider?: string
  network?: string
  channel?: string
  category?: string
  tags?: string[]
  customMetadata?: Record<string, any>
  epgId?: string
  contentRating?: string
  copyright?: string
  isLive: boolean
  startTime?: string
  endTime?: string
}

interface AdBreak {
  id: string
  streamId: string
  scheduledTime: string
  duration: number
  adId: string
  status: 'scheduled' | 'triggered' | 'completed'
  scteEventId?: number
  cueType: 'CUE-OUT' | 'CUE-IN'
  preRollDuration: number
  crashOut: boolean
  scte35Pid: number
}

interface InputSource {
  id: string
  name: string
  type: 'RTMP' | 'SRT' | 'NDI' | 'UDP' | 'DeckLink'
  url: string
  status: 'connected' | 'disconnected' | 'error'
  bitrate: number
  resolution: string
  health: 'good' | 'warning' | 'error'
  lastSeen: string
}

interface OutputDestination {
  id: string
  name: string
  type: 'HLS' | 'RTMP' | 'SRT' | 'DASH' | 'WebRTC'
  url: string
  status: 'active' | 'inactive' | 'error'
  viewers: number
  bitrate: number
}

interface EncodingProfile {
  id: string
  name: string
  videoCodec: string
  audioCodec: string
  bitrate: number
  resolution: string
  framerate: string
  keyframeInterval: number
  gopSize: number
  bFrames: number
  profile: string
  preset: string
}

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: '1',
      name: 'Main Stream',
      inputUrl: 'srt://input.example.com:9999?streamid=live1',
      outputUrl: 'srt://output.example.com:9999?streamid=live1',
      status: 'idle',
      bitrate: 5000,
      resolution: '1920x1080',
      scte35Enabled: true,
      encoderPreset: 'high',
      gopSize: 12,
      bFrames: 5,
      profile: 'high',
      chroma: '4:2:0',
      aspectRatio: '16:9',
      keyframeInterval: 12,
      pcr: 'video_embedded',
      audioCodec: 'aac-lc',
      audioBitrate: 128,
      audioLKFS: -20,
      audioSampleRate: 48000,
      scte35Pid: 500,
      nullPid: 8191,
      latency: 2000,
      
      // SRT-specific fields
      srtLatency: 120,
      srtBandwidthOverhead: 25,
      srtPassphrase: '',
      srtStreamId: 'live1',
      
      // Metadata fields
      description: 'Main live streaming channel',
      genre: 'Entertainment',
      language: 'en',
      provider: 'Your Provider',
      network: 'Main Network',
      channel: 'Channel 1',
      category: 'Live',
      tags: ['live', 'entertainment', 'hd'],
      customMetadata: {
        'quality': 'high',
        'region': 'US',
        'timezone': 'EST'
      },
      epgId: 'EPG001',
      contentRating: 'TV-G',
      copyright: '© 2024 Your Provider',
      isLive: true,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
    }
  ])

  const [adBreaks, setAdBreaks] = useState<AdBreak[]>([
    {
      id: '1',
      streamId: '1',
      scheduledTime: '2024-01-15T14:30:00Z',
      duration: 600,
      adId: 'ad001',
      status: 'scheduled',
      cueType: 'CUE-OUT',
      preRollDuration: 0,
      crashOut: false,
      scte35Pid: 500
    }
  ])

  const [inputSources, setInputSources] = useState<InputSource[]>([
    {
      id: '1',
      name: 'RTMP Primary',
      type: 'RTMP',
      url: 'rtmp://input.example.com/live/stream1',
      status: 'connected',
      bitrate: 5000,
      resolution: '1920x1080',
      health: 'good',
      lastSeen: '2 minutes ago'
    },
    {
      id: '2',
      name: 'SRT Backup',
      type: 'SRT',
      url: 'srt://backup.example.com:4200/stream1',
      status: 'disconnected',
      bitrate: 0,
      resolution: 'N/A',
      health: 'warning',
      lastSeen: '1 hour ago'
    }
  ])

  const [outputDestinations, setOutputDestinations] = useState<OutputDestination[]>([
    {
      id: '1',
      name: 'HLS Primary',
      type: 'HLS',
      url: 'https://cdn.example.com/live/stream1/master.m3u8',
      status: 'active',
      viewers: 1250,
      bitrate: 5000
    },
    {
      id: '2',
      name: 'SRT Output',
      type: 'SRT',
      url: 'srt://output.example.com:9999?streamid=live1',
      status: 'active',
      viewers: 850,
      bitrate: 5000
    },
    {
      id: '3',
      name: 'RTMP Backup',
      type: 'RTMP',
      url: 'rtmp://backup.example.com/live/stream1',
      status: 'inactive',
      viewers: 0,
      bitrate: 0
    }
  ])

  const [encodingProfiles, setEncodingProfiles] = useState<EncodingProfile[]>([
    {
      id: '1',
      name: 'High Quality 1080p',
      videoCodec: 'H.264',
      audioCodec: 'AAC-LC',
      bitrate: 5000,
      resolution: '1920x1080',
      framerate: '30fps',
      keyframeInterval: 12,
      gopSize: 12,
      bFrames: 5,
      profile: 'high',
      preset: 'high'
    },
    {
      id: '2',
      name: 'Standard 720p',
      videoCodec: 'H.264',
      audioCodec: 'AAC-LC',
      bitrate: 2500,
      resolution: '1280x720',
      framerate: '30fps',
      keyframeInterval: 12,
      gopSize: 12,
      bFrames: 3,
      profile: 'main',
      preset: 'medium'
    }
  ])

  const [selectedStream, setSelectedStream] = useState<string>('1')
  const [isEncoding, setIsEncoding] = useState(false)
  const [encodingProgress, setEncodingProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data for system health
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

  const startEncoding = () => {
    setIsEncoding(true)
    setEncodingProgress(0)
    
    // Simulate encoding progress
    const interval = setInterval(() => {
      setEncodingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsEncoding(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const stopEncoding = () => {
    setIsEncoding(false)
    setEncodingProgress(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'encoding':
      case 'running':
      case 'connected':
      case 'active':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'idle':
      case 'disconnected':
      case 'inactive':
        return 'bg-gray-500'
      case 'scheduled':
      case 'triggered':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (stream.description && stream.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || stream.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Live Streaming Encoder
          </h1>
          <p className="text-muted-foreground">
            Professional SCTE-35 Ad Marker & Scheduler
          </p>
        </header>

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

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Streams
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="inputs" className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Inputs
            </TabsTrigger>
            <TabsTrigger value="outputs" className="flex items-center gap-2">
              <MonitorSpeaker className="h-4 w-4" />
              Outputs
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Profiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
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

            {/* Active Streams */}
            <Card className="aws-channel-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Radio className="h-5 w-5" />
                      Active Streams
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Currently running live streaming channels
                    </CardDescription>
                  </div>
                  <Button className="aws-button-gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Stream
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streams.filter(s => s.status === 'running').map((stream) => (
                    <div key={stream.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className={`h-2 w-2 rounded-full ${
                            stream.status === 'running' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate" title={stream.name}>{stream.name}</h3>
                          <p className="text-sm text-gray-400 truncate">{stream.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full lg:w-auto">
                          <div className="flex items-center gap-1 min-w-0">
                            <Monitor className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 truncate" title={stream.inputUrl}>{stream.inputUrl}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <Film className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 truncate" title={stream.outputUrl}>{stream.outputUrl}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <Zap className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 truncate">{stream.bitrate} Kbps</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        <div className="flex gap-4">
                          <div className="text-center sm:text-left">
                            <div className="text-sm font-medium text-white">1250</div>
                            <div className="text-xs text-gray-400">viewers</div>
                          </div>
                          <div className="text-center sm:text-left">
                            <div className="text-sm font-medium text-white">2h 15m</div>
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
          </TabsContent>

          <TabsContent value="streams" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stream Configuration</CardTitle>
                  <CardDescription>
                    Configure your live stream input and output settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="streamName">Stream Name</Label>
                    <Input id="streamName" placeholder="Main Stream" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inputUrl">Input URL (SRT)</Label>
                    <Input 
                      id="inputUrl" 
                      placeholder="srt://input.example.com:9999?streamid=live1" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="outputUrl">Output URL (SRT)</Label>
                    <Input 
                      id="outputUrl" 
                      placeholder="srt://output.example.com:9999?streamid=live1" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bitrate">Video Bitrate (Mbps)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3000">3</SelectItem>
                          <SelectItem value="5000">5</SelectItem>
                          <SelectItem value="8000">8</SelectItem>
                          <SelectItem value="10000">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="1920x1080" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1280x720">1280x720</SelectItem>
                          <SelectItem value="1920x1080">1920x1080</SelectItem>
                          <SelectItem value="3840x2160">3840x2160</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="encoderPreset">Encoder Preset</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="high" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ultrafast">ultrafast</SelectItem>
                          <SelectItem value="superfast">superfast</SelectItem>
                          <SelectItem value="veryfast">veryfast</SelectItem>
                          <SelectItem value="faster">faster</SelectItem>
                          <SelectItem value="fast">fast</SelectItem>
                          <SelectItem value="medium">medium</SelectItem>
                          <SelectItem value="slow">slow</SelectItem>
                          <SelectItem value="slower">slower</SelectItem>
                          <SelectItem value="veryslow">veryslow</SelectItem>
                          <SelectItem value="high">high</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile">Profile</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="high" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baseline">baseline</SelectItem>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="high">high</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gopSize">GOP Size</Label>
                      <Input id="gopSize" type="number" defaultValue="12" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bFrames">B Frames</Label>
                      <Input id="bFrames" type="number" defaultValue="5" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chroma">Chroma</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="4:2:0" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4:2:0">4:2:0</SelectItem>
                          <SelectItem value="4:2:2">4:2:2</SelectItem>
                          <SelectItem value="4:4:4">4:4:4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audioBitrate">Audio Bitrate (Kbps)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="128" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="64">64</SelectItem>
                          <SelectItem value="96">96</SelectItem>
                          <SelectItem value="128">128</SelectItem>
                          <SelectItem value="192">192</SelectItem>
                          <SelectItem value="256">256</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="audioLKFS">Audio LKFS</Label>
                      <Input id="audioLKFS" type="number" defaultValue="-20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
                      <Input id="scte35Pid" type="number" defaultValue="500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="latency">Latency (ms)</Label>
                      <Input id="latency" type="number" defaultValue="2000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="srtLatency">SRT Latency (ms)</Label>
                      <Input id="srtLatency" type="number" defaultValue="120" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="srtBandwidth">SRT Bandwidth Overhead (%)</Label>
                      <Input id="srtBandwidth" type="number" defaultValue="25" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="srtPassphrase">SRT Passphrase</Label>
                      <Input id="srtPassphrase" type="password" placeholder="Optional passphrase" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="srtStreamId">SRT Stream ID</Label>
                      <Input id="srtStreamId" placeholder="live1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="scte35" defaultChecked />
                    <Label htmlFor="scte35">Enable SCTE-35 Ad Markers</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={startEncoding} 
                      disabled={isEncoding}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Encoding
                    </Button>
                    <Button 
                      onClick={stopEncoding} 
                      disabled={!isEncoding}
                      variant="outline"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Streams</CardTitle>
                  <CardDescription>
                    Monitor your current streaming sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEncoding && (
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Encoding Progress</span>
                        <span className="text-sm text-muted-foreground">{encodingProgress}%</span>
                      </div>
                      <Progress value={encodingProgress} className="w-full" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {filteredStreams.map((stream) => (
                      <div key={stream.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{stream.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(stream.status)} text-white`}
                          >
                            {stream.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Input: {stream.inputUrl}</p>
                          <p>Output: {stream.outputUrl}</p>
                          <p>Bitrate: {stream.bitrate} Kbps</p>
                          <p>Resolution: {stream.resolution}</p>
                          <div className="flex items-center gap-2">
                            <span>SCTE-35:</span>
                            <Badge variant={stream.scte35Enabled ? "default" : "secondary"}>
                              {stream.scte35Enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Ad Break
                  </CardTitle>
                  <CardDescription>
                    Create and manage SCTE-35 ad break schedules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adBreakName">Ad Break Name</Label>
                    <Input id="adBreakName" placeholder="Commercial Break 1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="streamSelect">Select Stream</Label>
                    <Select value={selectedStream} onValueChange={setSelectedStream}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input 
                      id="scheduledTime" 
                      type="datetime-local" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      placeholder="30" 
                      defaultValue="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adId">Ad ID</Label>
                    <Input id="adId" placeholder="ad001" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adDescription">Description</Label>
                    <Textarea 
                      id="adDescription" 
                      placeholder="Optional ad break description..." 
                    />
                  </div>
                  
                  <Button className="w-full">
                    Schedule Ad Break
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Ad Breaks</CardTitle>
                  <CardDescription>
                    View and manage your ad break schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adBreaks.map((adBreak) => {
                      const stream = streams.find(s => s.id === adBreak.streamId)
                      return (
                        <div key={adBreak.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Ad Break {adBreak.adId}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(adBreak.status)} text-white`}
                            >
                              {adBreak.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Stream: {stream?.name || 'Unknown'}</p>
                            <p>Scheduled: {new Date(adBreak.scheduledTime).toLocaleString()}</p>
                            <p>Duration: {adBreak.duration} seconds</p>
                            <p>Ad ID: {adBreak.adId}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Input Sources
                  </CardTitle>
                  <CardDescription>
                    Manage your input sources and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inputSources.map((input) => (
                      <div key={input.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{input.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(input.status)} text-white`}
                          >
                            {input.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Type: {input.type}</p>
                          <p>URL: {input.url}</p>
                          <p>Bitrate: {input.bitrate} Kbps</p>
                          <p>Resolution: {input.resolution}</p>
                          <p>Health: {input.health}</p>
                          <p>Last Seen: {input.lastSeen}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Input Source</CardTitle>
                  <CardDescription>
                    Configure a new input source
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inputName">Input Name</Label>
                    <Input id="inputName" placeholder="RTMP Primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inputType">Input Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select input type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RTMP">RTMP</SelectItem>
                        <SelectItem value="SRT">SRT</SelectItem>
                        <SelectItem value="NDI">NDI</SelectItem>
                        <SelectItem value="UDP">UDP</SelectItem>
                        <SelectItem value="DeckLink">DeckLink</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inputUrl">Input URL</Label>
                    <Input 
                      id="inputUrl" 
                      placeholder="rtmp://input.example.com/live/stream1" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inputBitrate">Expected Bitrate (Kbps)</Label>
                      <Input id="inputBitrate" type="number" defaultValue="5000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="inputResolution">Resolution</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="1920x1080" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1280x720">1280x720</SelectItem>
                          <SelectItem value="1920x1080">1920x1080</SelectItem>
                          <SelectItem value="3840x2160">3840x2160</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Add Input Source
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outputs" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MonitorSpeaker className="h-5 w-5" />
                    Output Destinations
                  </CardTitle>
                  <CardDescription>
                    Manage your output destinations and streams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outputDestinations.map((output) => (
                      <div key={output.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{output.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(output.status)} text-white`}
                          >
                            {output.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Type: {output.type}</p>
                          <p>URL: {output.url}</p>
                          <p>Viewers: {output.viewers}</p>
                          <p>Bitrate: {output.bitrate} Kbps</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Output Destination</CardTitle>
                  <CardDescription>
                    Configure a new output destination
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outputName">Output Name</Label>
                    <Input id="outputName" placeholder="HLS Primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="outputType">Output Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select output type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HLS">HLS</SelectItem>
                        <SelectItem value="RTMP">RTMP</SelectItem>
                        <SelectItem value="SRT">SRT</SelectItem>
                        <SelectItem value="DASH">DASH</SelectItem>
                        <SelectItem value="WebRTC">WebRTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="outputUrl">Output URL</Label>
                    <Input 
                      id="outputUrl" 
                      placeholder="srt://output.example.com:9999?streamid=live1" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="outputBitrate">Bitrate (Kbps)</Label>
                      <Input id="outputBitrate" type="number" defaultValue="5000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="outputViewers">Expected Viewers</Label>
                      <Input id="outputViewers" type="number" defaultValue="1000" />
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Add Output Destination
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="h-5 w-5" />
                    Encoding Profiles
                  </CardTitle>
                  <CardDescription>
                    Manage your encoding profiles and presets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {encodingProfiles.map((profile) => (
                      <div key={profile.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{profile.name}</h3>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Video: {profile.videoCodec}</p>
                          <p>Audio: {profile.audioCodec}</p>
                          <p>Bitrate: {profile.bitrate} Kbps</p>
                          <p>Resolution: {profile.resolution}</p>
                          <p>Framerate: {profile.framerate}</p>
                          <p>Profile: {profile.profile}</p>
                          <p>Preset: {profile.preset}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create Encoding Profile</CardTitle>
                  <CardDescription>
                    Configure a new encoding profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileName">Profile Name</Label>
                    <Input id="profileName" placeholder="High Quality 1080p" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoCodec">Video Codec</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="H.264" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="H.264">H.264</SelectItem>
                          <SelectItem value="H.265">H.265</SelectItem>
                          <SelectItem value="AV1">AV1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="audioCodec">Audio Codec</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="AAC-LC" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AAC-LC">AAC-LC</SelectItem>
                          <SelectItem value="AAC-HE">AAC-HE</SelectItem>
                          <SelectItem value="MP3">MP3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileBitrate">Bitrate (Kbps)</Label>
                      <Input id="profileBitrate" type="number" defaultValue="5000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileResolution">Resolution</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="1920x1080" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1280x720">1280x720</SelectItem>
                          <SelectItem value="1920x1080">1920x1080</SelectItem>
                          <SelectItem value="3840x2160">3840x2160</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="framerate">Framerate</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="30fps" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24fps">24fps</SelectItem>
                          <SelectItem value="25fps">25fps</SelectItem>
                          <SelectItem value="30fps">30fps</SelectItem>
                          <SelectItem value="60fps">60fps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileProfile">Profile</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="high" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baseline">baseline</SelectItem>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="high">high</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}