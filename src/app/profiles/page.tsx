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
  SdCard,
  Save,
  Download,
  Upload,
  FileText,
  Sliders,
  Layers,
  Target,
  Award,
  Star
} from 'lucide-react'

export default function ProfilesPage() {
  const breadcrumbItems = [
    { label: 'Encoding Profiles' }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data for demonstration
  const profiles = [
    {
      id: 'PF-001',
      name: 'High Quality 1080p',
      description: 'High bitrate 1080p profile for premium content',
      type: 'video',
      codec: 'H.264',
      profile: 'High',
      preset: 'medium',
      bitrate: 5000,
      maxBitrate: 8000,
      bufferSize: 12000,
      resolution: '1920x1080',
      frameRate: 30,
      gopSize: 60,
      bFrames: 3,
      chroma: '4:2:0',
      scanType: 'progressive',
      interlaced: false,
      keyframeInterval: 2,
      segmentDuration: 6,
      audioBitrate: 128,
      audioCodec: 'AAC',
      audioSampleRate: 48000,
      audioChannels: 2,
      scte35Enabled: true,
      scte35Pid: 500,
      isDefault: true,
      isBuiltIn: false,
      usageCount: 15,
      lastUsed: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-10T10:00:00Z',
      tags: ['high-quality', '1080p', 'premium']
    },
    {
      id: 'PF-002',
      name: 'Standard 720p',
      description: 'Standard quality 720p profile for general use',
      type: 'video',
      codec: 'H.264',
      profile: 'Main',
      preset: 'fast',
      bitrate: 2500,
      maxBitrate: 4000,
      bufferSize: 6000,
      resolution: '1280x720',
      frameRate: 30,
      gopSize: 60,
      bFrames: 2,
      chroma: '4:2:0',
      scanType: 'progressive',
      interlaced: false,
      keyframeInterval: 2,
      segmentDuration: 6,
      audioBitrate: 96,
      audioCodec: 'AAC',
      audioSampleRate: 44100,
      audioChannels: 2,
      scte35Enabled: true,
      scte35Pid: 500,
      isDefault: false,
      isBuiltIn: false,
      usageCount: 23,
      lastUsed: '2024-01-15T14:25:00Z',
      createdAt: '2024-01-10T10:00:00Z',
      tags: ['standard', '720p', 'general']
    },
    {
      id: 'PF-003',
      name: 'Ultra HD 4K',
      description: 'Ultra high definition 4K profile for premium content',
      type: 'video',
      codec: 'H.265',
      profile: 'Main',
      preset: 'slow',
      bitrate: 12000,
      maxBitrate: 20000,
      bufferSize: 30000,
      resolution: '3840x2160',
      frameRate: 30,
      gopSize: 60,
      bFrames: 4,
      chroma: '4:2:0',
      scanType: 'progressive',
      interlaced: false,
      keyframeInterval: 2,
      segmentDuration: 6,
      audioBitrate: 192,
      audioCodec: 'AAC',
      audioSampleRate: 48000,
      audioChannels: 6,
      scte35Enabled: true,
      scte35Pid: 500,
      isDefault: false,
      isBuiltIn: false,
      usageCount: 8,
      lastUsed: '2024-01-15T14:20:00Z',
      createdAt: '2024-01-12T09:00:00Z',
      tags: ['4k', 'ultra-hd', 'premium', 'hevc']
    },
    {
      id: 'PF-004',
      name: 'Mobile Optimized',
      description: 'Low bitrate profile optimized for mobile devices',
      type: 'video',
      codec: 'H.264',
      profile: 'Baseline',
      preset: 'ultrafast',
      bitrate: 800,
      maxBitrate: 1200,
      bufferSize: 1800,
      resolution: '854x480',
      frameRate: 30,
      gopSize: 90,
      bFrames: 0,
      chroma: '4:2:0',
      scanType: 'progressive',
      interlaced: false,
      keyframeInterval: 3,
      segmentDuration: 10,
      audioBitrate: 64,
      audioCodec: 'AAC',
      audioSampleRate: 44100,
      audioChannels: 2,
      scte35Enabled: false,
      scte35Pid: 500,
      isDefault: false,
      isBuiltIn: false,
      usageCount: 45,
      lastUsed: '2024-01-15T14:15:00Z',
      createdAt: '2024-01-08T12:00:00Z',
      tags: ['mobile', 'low-bitrate', '480p']
    },
    {
      id: 'PF-005',
      name: 'Audio Only',
      description: 'Audio-only profile for radio and music streaming',
      type: 'audio',
      codec: 'AAC',
      profile: 'LC',
      preset: 'medium',
      bitrate: 128,
      maxBitrate: 192,
      bufferSize: 288,
      resolution: '0x0',
      frameRate: 0,
      gopSize: 0,
      bFrames: 0,
      chroma: 'N/A',
      scanType: 'N/A',
      interlaced: false,
      keyframeInterval: 0,
      segmentDuration: 6,
      audioBitrate: 128,
      audioCodec: 'AAC',
      audioSampleRate: 48000,
      audioChannels: 2,
      scte35Enabled: true,
      scte35Pid: 500,
      isDefault: false,
      isBuiltIn: false,
      usageCount: 12,
      lastUsed: '2024-01-15T13:00:00Z',
      createdAt: '2024-01-05T08:00:00Z',
      tags: ['audio-only', 'radio', 'music']
    }
  ]

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || profile.type === typeFilter
    return matchesSearch && matchesType
  })

  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Film className="h-5 w-5" />
      case 'audio':
        return <Monitor className="h-5 w-5" />
      default:
        return <Sliders className="h-5 w-5" />
    }
  }

  const getCodecBadge = (codec: string) => {
    switch (codec) {
      case 'H.264':
        return <Badge variant="outline">H.264</Badge>
      case 'H.265':
        return <Badge variant="outline">H.265</Badge>
      case 'AAC':
        return <Badge variant="outline">AAC</Badge>
      default:
        return <Badge variant="outline">{codec}</Badge>
    }
  }

  const getQualityColor = (bitrate: number) => {
    if (bitrate >= 8000) return 'text-purple-600'
    if (bitrate >= 4000) return 'text-blue-600'
    if (bitrate >= 2000) return 'text-green-600'
    return 'text-orange-600'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Encoding Profiles" 
            subtitle="Manage and configure encoding profiles for different output qualities"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Profiles</p>
                  <p className="text-2xl font-bold">{profiles.length}</p>
                </div>
                <Sliders className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Video Profiles</p>
                  <p className="text-2xl font-bold">{profiles.filter(p => p.type === 'video').length}</p>
                </div>
                <Film className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Audio Profiles</p>
                  <p className="text-2xl font-bold">{profiles.filter(p => p.type === 'audio').length}</p>
                </div>
                <Monitor className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Default Profiles</p>
                  <p className="text-2xl font-bold">{profiles.filter(p => p.isDefault).length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Encoding Profiles</CardTitle>
                <CardDescription>
                  Configure encoding profiles for different output qualities and use cases
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Encoding Profile</DialogTitle>
                      <DialogDescription>
                        Configure a new encoding profile with video and audio settings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="video">Video</TabsTrigger>
                          <TabsTrigger value="audio">Audio</TabsTrigger>
                          <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="profileName">Profile Name</Label>
                              <Input id="profileName" placeholder="High Quality 1080p" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="profileType">Profile Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="audio">Audio Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Profile description..." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="codec">Codec</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select codec" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="h264">H.264/AVC</SelectItem>
                                  <SelectItem value="h265">H.265/HEVC</SelectItem>
                                  <SelectItem value="vp9">VP9</SelectItem>
                                  <SelectItem value="av1">AV1</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="profile">Profile Level</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select profile" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="baseline">Baseline</SelectItem>
                                  <SelectItem value="main">Main</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="video" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="resolution">Resolution</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select resolution" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                                  <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                                  <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                                  <SelectItem value="854x480">854x480 (480p)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="frameRate">Frame Rate</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frame rate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="24">24 fps</SelectItem>
                                  <SelectItem value="25">25 fps</SelectItem>
                                  <SelectItem value="30">30 fps</SelectItem>
                                  <SelectItem value="50">50 fps</SelectItem>
                                  <SelectItem value="60">60 fps</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bitrate">Bitrate (Kbps)</Label>
                              <Input id="bitrate" type="number" placeholder="5000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="maxBitrate">Max Bitrate (Kbps)</Label>
                              <Input id="maxBitrate" type="number" placeholder="8000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bufferSize">Buffer Size (Kbps)</Label>
                              <Input id="bufferSize" type="number" placeholder="12000" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="preset">Encoder Preset</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select preset" />
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
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gopSize">GOP Size (seconds)</Label>
                              <Input id="gopSize" type="number" placeholder="2" />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="audio" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="audioCodec">Audio Codec</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select codec" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="aac">AAC</SelectItem>
                                  <SelectItem value="mp3">MP3</SelectItem>
                                  <SelectItem value="opus">Opus</SelectItem>
                                  <SelectItem value="ac3">AC-3</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="audioBitrate">Audio Bitrate (Kbps)</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bitrate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="64">64</SelectItem>
                                  <SelectItem value="96">96</SelectItem>
                                  <SelectItem value="128">128</SelectItem>
                                  <SelectItem value="192">192</SelectItem>
                                  <SelectItem value="256">256</SelectItem>
                                  <SelectItem value="320">320</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="audioSampleRate">Sample Rate (Hz)</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sample rate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="44100">44.1 kHz</SelectItem>
                                  <SelectItem value="48000">48 kHz</SelectItem>
                                  <SelectItem value="96000">96 kHz</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="audioChannels">Audio Channels</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select channels" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Mono</SelectItem>
                                  <SelectItem value="2">Stereo</SelectItem>
                                  <SelectItem value="6">5.1 Surround</SelectItem>
                                  <SelectItem value="8">7.1 Surround</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="advanced" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bFrames">B Frames</Label>
                              <Input id="bFrames" type="number" placeholder="3" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="chroma">Chroma Subsampling</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chroma" />
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
                              <Label htmlFor="segmentDuration">Segment Duration (seconds)</Label>
                              <Input id="segmentDuration" type="number" placeholder="6" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="keyframeInterval">Keyframe Interval (seconds)</Label>
                              <Input id="keyframeInterval" type="number" placeholder="2" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch id="scte35" />
                              <Label htmlFor="scte35">Enable SCTE-35</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="default" />
                              <Label htmlFor="default">Set as Default</Label>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                          Create Profile
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search profiles..."
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
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getProfileIcon(profile.type)}
                        <div>
                          <h3 className="font-semibold">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCodecBadge(profile.codec)}
                        {profile.isDefault && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Bitrate</div>
                          <div className={`font-medium ${getQualityColor(profile.bitrate)}`}>
                            {profile.bitrate} Kbps
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Resolution</div>
                          <div className="font-medium">{profile.resolution}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Frame Rate</div>
                          <div className="font-medium">{profile.frameRate} fps</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Usage</div>
                          <div className="font-medium">{profile.usageCount} times</div>
                        </div>
                      </div>
                      
                      {profile.type === 'video' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Max Bitrate</span>
                            <span>{profile.maxBitrate} Kbps</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Buffer Size</span>
                            <span>{profile.bufferSize} Kbps</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Audio Bitrate</span>
                            <span>{profile.audioBitrate} Kbps</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {profile.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Last used: {new Date(profile.lastUsed).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
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