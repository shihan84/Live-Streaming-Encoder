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
import { Play, Square, Settings, Calendar, Activity, Video, Tv } from 'lucide-react'

interface Stream {
  id: string
  name: string
  inputUrl: string
  outputUrl: string
  status: 'idle' | 'encoding' | 'error'
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

  const [selectedStream, setSelectedStream] = useState<string>('1')
  const [isEncoding, setIsEncoding] = useState(false)
  const [encodingProgress, setEncodingProgress] = useState(0)

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
      case 'encoding': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'idle': return 'bg-gray-500'
      case 'scheduled': return 'bg-blue-500'
      case 'triggered': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

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

        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Streams
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ad Scheduler
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

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
                  
                  {/* Metadata Section */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Stream Metadata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Stream description" 
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="genre">Genre</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="documentary">Documentary</SelectItem>
                            <SelectItem value="live">Live Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="en" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <Input id="provider" placeholder="Content provider" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="network">Network</Label>
                        <Input id="network" placeholder="Network name" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="channel">Channel</Label>
                        <Input id="channel" placeholder="Channel name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="recorded">Recorded</SelectItem>
                            <SelectItem value="vod">Video on Demand</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contentRating">Content Rating</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="TV-G" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TV-Y">TV-Y</SelectItem>
                            <SelectItem value="TV-Y7">TV-Y7</SelectItem>
                            <SelectItem value="TV-G">TV-G</SelectItem>
                            <SelectItem value="TV-PG">TV-PG</SelectItem>
                            <SelectItem value="TV-14">TV-14</SelectItem>
                            <SelectItem value="TV-MA">TV-MA</SelectItem>
                            <SelectItem value="G">G</SelectItem>
                            <SelectItem value="PG">PG</SelectItem>
                            <SelectItem value="PG-13">PG-13</SelectItem>
                            <SelectItem value="R">R</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="epgId">EPG ID</Label>
                        <Input id="epgId" placeholder="Electronic Program Guide ID" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="copyright">Copyright</Label>
                        <Input id="copyright" placeholder="© 2024 Provider Name" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input id="startTime" type="datetime-local" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input id="endTime" type="datetime-local" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input 
                        id="tags" 
                        placeholder="live, hd, entertainment, sports" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customMetadata">Custom Metadata (JSON)</Label>
                      <Textarea 
                        id="customMetadata" 
                        placeholder='{"quality": "high", "region": "US", "timezone": "EST", "custom_field": "value"}' 
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="isLive" defaultChecked />
                      <Label htmlFor="isLive">Live Stream</Label>
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
                    {streams.map((stream) => (
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
                          <p>Bitrate: {stream.bitrate} Mbps</p>
                          <p>Resolution: {stream.resolution}</p>
                          <div className="flex items-center gap-2">
                            <span>SCTE-35:</span>
                            <Badge variant={stream.scte35Enabled ? "default" : "secondary"}>
                              {stream.scte35Enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          
                          {/* Metadata Display */}
                          {(stream.description || stream.genre || stream.language || stream.provider || stream.network) && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs font-medium">Basic Metadata</summary>
                              <div className="text-xs bg-muted p-2 rounded mt-1 space-y-1">
                                {stream.description && <p><strong>Description:</strong> {stream.description}</p>}
                                {stream.genre && <p><strong>Genre:</strong> {stream.genre}</p>}
                                {stream.language && <p><strong>Language:</strong> {stream.language}</p>}
                                {stream.provider && <p><strong>Provider:</strong> {stream.provider}</p>}
                                {stream.network && <p><strong>Network:</strong> {stream.network}</p>}
                                {stream.channel && <p><strong>Channel:</strong> {stream.channel}</p>}
                                {stream.category && <p><strong>Category:</strong> {stream.category}</p>}
                                {stream.contentRating && <p><strong>Rating:</strong> {stream.contentRating}</p>}
                                {stream.isLive !== undefined && (
                                  <p><strong>Type:</strong> {stream.isLive ? "Live" : "Recorded"}</p>
                                )}
                              </div>
                            </details>
                          )}
                          
                          {/* Tags */}
                          {stream.tags && stream.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {stream.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Custom Metadata */}
                          {stream.customMetadata && Object.keys(stream.customMetadata).length > 0 && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs font-medium">Custom Metadata</summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(stream.customMetadata, null, 2)}
                              </pre>
                            </details>
                          )}
                          
                          {/* Timing Information */}
                          {(stream.startTime || stream.endTime) && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs font-medium">Schedule</summary>
                              <div className="text-xs bg-muted p-2 rounded mt-1 space-y-1">
                                {stream.startTime && (
                                  <p><strong>Start:</strong> {new Date(stream.startTime).toLocaleString()}</p>
                                )}
                                {stream.endTime && (
                                  <p><strong>End:</strong> {new Date(stream.endTime).toLocaleString()}</p>
                                )}
                              </div>
                            </details>
                          )}
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
                    <Tv className="h-5 w-5" />
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <Input 
                        id="duration" 
                        type="number" 
                        placeholder="600" 
                        defaultValue="600"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preRollDuration">Pre-roll Duration (0-10s)</Label>
                      <Input 
                        id="preRollDuration" 
                        type="number" 
                        placeholder="0" 
                        defaultValue="0"
                        min="0"
                        max="10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adId">Ad ID</Label>
                    <Input id="adId" placeholder="ad001" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cueType">Cue Type</Label>
                      <Select defaultValue="CUE-OUT">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUE-OUT">CUE-OUT (Program Out)</SelectItem>
                          <SelectItem value="CUE-IN">CUE-IN (Program In)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
                      <Input 
                        id="scte35Pid" 
                        type="number" 
                        placeholder="500" 
                        defaultValue="500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adDescription">Description</Label>
                    <Textarea 
                      id="adDescription" 
                      placeholder="Optional ad break description..." 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="crashOut" />
                    <Label htmlFor="crashOut">Enable Crash Out Scenario</Label>
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
                            <p>Cue Type: {adBreak.cueType}</p>
                            <p>Pre-roll: {adBreak.preRollDuration}s</p>
                            {adBreak.scteEventId && <p>SCTE Event ID: {adBreak.scteEventId}</p>}
                            <p>SCTE-35 PID: {adBreak.scte35Pid}</p>
                            {adBreak.crashOut && <p className="text-yellow-600">Crash Out Enabled</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Encoder Status</span>
                      <Badge variant={isEncoding ? "default" : "secondary"}>
                        {isEncoding ? "Active" : "Idle"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SCTE-35 Service</span>
                      <Badge variant="default">Running</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>HLS Segmenter</span>
                      <Badge variant="default">Running</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Ad Scheduler</span>
                      <Badge variant="default">Running</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stream Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Streams</span>
                      <span className="font-mono">{streams.filter(s => s.status === 'encoding').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Bitrate</span>
                      <span className="font-mono">
                        {streams.reduce((acc, stream) => acc + stream.bitrate, 0)} kbps
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SCTE-35 Events</span>
                      <span className="font-mono">{adBreaks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-mono">2h 34m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Stream started - Main Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>SCTE-35 marker inserted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Ad break scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>HLS segment created</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  Real-time system logs and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                  <div className="text-green-600">[2024-01-15 14:25:30] Encoder started successfully</div>
                  <div className="text-blue-600">[2024-01-15 14:25:31] SCTE-35 service initialized</div>
                  <div className="text-blue-600">[2024-01-15 14:25:32] HLS segmenter started</div>
                  <div className="text-yellow-600">[2024-01-15 14:25:33] Ad scheduler service started</div>
                  <div className="text-green-600">[2024-01-15 14:25:34] Stream configuration loaded</div>
                  <div className="text-blue-600">[2024-01-15 14:25:35] WebSocket server listening on port 3001</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Encoder Settings</CardTitle>
                  <CardDescription>
                    Configure FFmpeg and encoding parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ffmpegPath">FFmpeg Path</Label>
                    <Input id="ffmpegPath" defaultValue="/usr/local/bin/ffmpeg" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encoderPreset">Encoder Preset</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultrafast">ultrafast</SelectItem>
                        <SelectItem value="superfast">superfast</SelectItem>
                        <SelectItem value="veryfast">veryfast</SelectItem>
                        <SelectItem value="faster">faster</SelectItem>
                        <SelectItem value="fast">fast</SelectItem>
                        <SelectItem value="medium">medium</SelectItem>
                        <SelectItem value="slow">slow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gopSize">GOP Size (seconds)</Label>
                    <Input id="gopSize" type="number" defaultValue="2" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keyframeInterval">Keyframe Interval</Label>
                    <Input id="keyframeInterval" type="number" defaultValue="60" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SCTE-35 Settings</CardTitle>
                  <CardDescription>
                    Configure SCTE-35 ad marker parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="scte35Enabled" defaultChecked />
                    <Label htmlFor="scte35Enabled">Enable SCTE-35 Support</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scte35Provider">Provider Name</Label>
                    <Input id="scte35Provider" defaultValue="YourProvider" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scte35ProviderId">Provider ID</Label>
                    <Input id="scte35ProviderId" defaultValue="0x1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="spliceInsertType">Splice Insert Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="program">Program</SelectItem>
                        <SelectItem value="component">Component</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="autoReturn">Auto Return (seconds)</Label>
                    <Input id="autoReturn" type="number" defaultValue="30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>HLS Settings</CardTitle>
                <CardDescription>
                  Configure HLS segmentation and output parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="segmentDuration">Segment Duration (seconds)</Label>
                    <Input id="segmentDuration" type="number" defaultValue="6" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="playlistSize">Playlist Size</Label>
                    <Input id="playlistSize" type="number" defaultValue="5" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="outputDir">Output Directory</Label>
                    <Input id="outputDir" defaultValue="/var/www/hls" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hlsTime">HLS Time</Label>
                    <Input id="hlsTime" type="number" defaultValue="6" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hlsListSize">HLS List Size</Label>
                    <Input id="hlsListSize" type="number" defaultValue="0" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hlsFlags">HLS Flags</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="delete_segments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete_segments">delete_segments</SelectItem>
                        <SelectItem value="append_list">append_list</SelectItem>
                        <SelectItem value="round_durations">round_durations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}