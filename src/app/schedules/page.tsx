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
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Calendar as CalendarIcon,
  Database,
  Cloud,
  Filter,
  Search,
  Shield,
  Wifi,
  Ethernet,
  Satellite,
  Hdmi,
  Video,
  Mic,
  CalendarDays,
  Timer,
  Repeat,
  MapPin,
  Users as UsersIcon,
  Star,
  Flag,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react'

export default function SchedulesPage() {
  const breadcrumbItems = [
    { label: 'Event Schedules' }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Mock data for demonstration
  const schedules = [
    {
      id: 'SCH-001',
      name: 'Weekly News Broadcast',
      description: 'Live news broadcast every Monday at 6 PM',
      type: 'recurring',
      status: 'active',
      channel: 'CH-002',
      startTime: '2024-01-15T18:00:00Z',
      endTime: '2024-01-15T19:00:00Z',
      duration: 60,
      recurrence: {
        type: 'weekly',
        days: ['monday'],
        interval: 1,
        endDate: '2024-12-31T23:59:59Z'
      },
      inputs: ['IN-001', 'IN-002'],
      outputs: ['OUT-001', 'OUT-003'],
      encodingProfile: 'PF-002',
      scte35Enabled: true,
      adBreaks: [
        { time: '00:15:00', duration: 30, adId: 'ad001' },
        { time: '00:30:00', duration: 30, adId: 'ad002' }
      ],
      notifications: {
        enabled: true,
        reminders: [15, 30, 60], // minutes before start
        alerts: ['start', 'end', 'error']
      },
      priority: 'high',
      tags: ['news', 'weekly', 'live'],
      createdAt: '2024-01-10T10:00:00Z',
      lastUpdated: '2024-01-15T14:30:00Z',
      nextRun: '2024-01-22T18:00:00Z'
    },
    {
      id: 'SCH-002',
      name: 'Sports Championship Final',
      description: 'Live coverage of the championship final match',
      type: 'one-time',
      status: 'scheduled',
      channel: 'CH-003',
      startTime: '2024-01-20T19:00:00Z',
      endTime: '2024-01-20T22:00:00Z',
      duration: 180,
      recurrence: null,
      inputs: ['IN-003', 'IN-005'],
      outputs: ['OUT-001', 'OUT-003', 'OUT-004'],
      encodingProfile: 'PF-003',
      scte35Enabled: true,
      adBreaks: [
        { time: '00:30:00', duration: 120, adId: 'ad003' },
        { time: '01:15:00', duration: 120, adId: 'ad004' },
        { time: '02:00:00', duration: 120, adId: 'ad005' }
      ],
      notifications: {
        enabled: true,
        reminders: [30, 60, 120], // minutes before start
        alerts: ['start', 'end', 'error']
      },
      priority: 'high',
      tags: ['sports', 'championship', 'live'],
      createdAt: '2024-01-15T14:00:00Z',
      lastUpdated: '2024-01-15T14:45:00Z',
      nextRun: '2024-01-20T19:00:00Z'
    },
    {
      id: 'SCH-003',
      name: 'Music Festival Live Stream',
      description: '24-hour live stream coverage of the music festival',
      type: 'one-time',
      status: 'running',
      channel: 'CH-001',
      startTime: '2024-01-15T15:00:00Z',
      endTime: '2024-01-16T15:00:00Z',
      duration: 1440,
      recurrence: null,
      inputs: ['IN-001'],
      outputs: ['OUT-001', 'OUT-002'],
      encodingProfile: 'PF-001',
      scte35Enabled: false,
      adBreaks: [],
      notifications: {
        enabled: true,
        reminders: [60, 120], // minutes before start
        alerts: ['start', 'end', 'error']
      },
      priority: 'medium',
      tags: ['music', 'festival', '24h'],
      createdAt: '2024-01-10T10:00:00Z',
      lastUpdated: '2024-01-15T14:30:00Z',
      nextRun: null
    },
    {
      id: 'SCH-004',
      name: 'Daily Tech Show',
      description: 'Daily technology news and reviews show',
      type: 'recurring',
      status: 'active',
      channel: 'CH-002',
      startTime: '2024-01-15T20:00:00Z',
      endTime: '2024-01-15T21:00:00Z',
      duration: 60,
      recurrence: {
        type: 'daily',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        interval: 1,
        endDate: '2024-12-31T23:59:59Z'
      },
      inputs: ['IN-001'],
      outputs: ['OUT-001'],
      encodingProfile: 'PF-002',
      scte35Enabled: true,
      adBreaks: [
        { time: '00:15:00', duration: 60, adId: 'ad006' },
        { time: '00:45:00', duration: 60, adId: 'ad007' }
      ],
      notifications: {
        enabled: true,
        reminders: [15, 30], // minutes before start
        alerts: ['start', 'end', 'error']
      },
      priority: 'medium',
      tags: ['tech', 'daily', 'show'],
      createdAt: '2024-01-08T12:00:00Z',
      lastUpdated: '2024-01-15T13:00:00Z',
      nextRun: '2024-01-16T20:00:00Z'
    },
    {
      id: 'SCH-005',
      name: 'Educational Webinar Series',
      description: 'Weekly educational webinars on various topics',
      type: 'recurring',
      status: 'paused',
      channel: 'CH-004',
      startTime: '2024-01-15T14:00:00Z',
      endTime: '2024-01-15T15:30:00Z',
      duration: 90,
      recurrence: {
        type: 'weekly',
        days: ['wednesday'],
        interval: 1,
        endDate: '2024-06-30T23:59:59Z'
      },
      inputs: ['IN-001'],
      outputs: ['OUT-001'],
      encodingProfile: 'PF-004',
      scte35Enabled: false,
      adBreaks: [],
      notifications: {
        enabled: true,
        reminders: [30, 60], // minutes before start
        alerts: ['start', 'end', 'error']
      },
      priority: 'low',
      tags: ['education', 'webinar', 'weekly'],
      createdAt: '2024-01-05T08:00:00Z',
      lastUpdated: '2024-01-10T16:00:00Z',
      nextRun: '2024-01-17T14:00:00Z'
    }
  ]

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter
    const matchesType = typeFilter === 'all' || schedule.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case 'running':
        return <Badge className="bg-purple-500">Running</Badge>
      case 'paused':
        return <Badge className="bg-yellow-500">Paused</Badge>
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recurring':
        return <Repeat className="h-5 w-5" />
      case 'one-time':
        return <CalendarDays className="h-5 w-5" />
      default:
        return <CalendarIcon className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="Event Schedules" 
            subtitle="Manage and schedule your live streaming events"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Schedules</p>
                  <p className="text-2xl font-bold">{schedules.length}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{schedules.filter(s => s.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                  <p className="text-2xl font-bold">
                    {schedules.filter(s => {
                      const today = new Date().toDateString()
                      const scheduleDate = new Date(s.startTime).toDateString()
                      return scheduleDate === today
                    }).length}
                  </p>
                </div>
                <Timer className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">{schedules.filter(s => s.priority === 'high').length}</p>
                </div>
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Schedule List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Schedule Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Event Schedules</CardTitle>
                    <CardDescription>
                      Manage your scheduled streaming events and broadcasts
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Schedule New Event</DialogTitle>
                        <DialogDescription>
                          Create a new scheduled streaming event with detailed configuration.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="eventName">Event Name</Label>
                                <Input id="eventName" placeholder="Live Event Stream" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="eventType">Event Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="one-time">One-time Event</SelectItem>
                                    <SelectItem value="recurring">Recurring Event</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" placeholder="Event description..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="channel">Channel</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select channel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CH-001">CH-001 - Live Event Stream</SelectItem>
                                    <SelectItem value="CH-002">CH-002 - 24/7 News Channel</SelectItem>
                                    <SelectItem value="CH-003">CH-003 - Sports Broadcast</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="schedule" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="datetime-local" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="datetime-local" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="duration">Duration (minutes)</Label>
                              <Input id="duration" type="number" placeholder="60" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recurrence">Recurrence</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select recurrence" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Recurrence</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="advanced" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="inputs">Input Sources</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select inputs" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="IN-001">IN-001 - Primary RTMP</SelectItem>
                                    <SelectItem value="IN-002">IN-002 - Backup SRT</SelectItem>
                                    <SelectItem value="IN-003">IN-003 - NDI Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="outputs">Output Destinations</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select outputs" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="OUT-001">OUT-001 - Primary HLS</SelectItem>
                                    <SelectItem value="OUT-002">OUT-002 - Backup RTMP</SelectItem>
                                    <SelectItem value="OUT-003">OUT-003 - 4K UHD</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                    <SelectItem value="PF-001">PF-001 - High Quality 1080p</SelectItem>
                                    <SelectItem value="PF-002">PF-002 - Standard 720p</SelectItem>
                                    <SelectItem value="PF-003">PF-003 - Ultra HD 4K</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input id="tags" placeholder="live, sports, news" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="scte35" />
                              <Label htmlFor="scte35">Enable SCTE-35 Ad Insertion</Label>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="notifications" className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Switch id="notifications" defaultChecked />
                              <Label htmlFor="notifications">Enable Notifications</Label>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reminders">Reminder Times (minutes)</Label>
                              <Input id="reminders" placeholder="15, 30, 60" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="alerts">Alert Types</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select alerts" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="start">Event Start</SelectItem>
                                  <SelectItem value="end">Event End</SelectItem>
                                  <SelectItem value="error">Error Alerts</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsCreateDialogOpen(false)}>
                            Schedule Event
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
                        placeholder="Search schedules..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredSchedules.map((schedule) => (
                    <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(schedule.type)}
                              <div>
                                <h3 className="font-semibold">{schedule.name}</h3>
                                <p className="text-sm text-muted-foreground">{schedule.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Radio className="h-4 w-4 text-muted-foreground" />
                                <span>{schedule.channel}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDuration(schedule.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Flag className="h-4 w-4 text-muted-foreground" />
                                <span className={`capitalize ${getPriorityColor(schedule.priority)}`}>
                                  {schedule.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(schedule.status)}
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
                        
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">{schedule.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-sm">
                            <div className="font-medium">Start Time</div>
                            <div className="text-muted-foreground">{formatDateTime(schedule.startTime)}</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">End Time</div>
                            <div className="text-muted-foreground">{formatDateTime(schedule.endTime)}</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Next Run</div>
                            <div className="text-muted-foreground">
                              {schedule.nextRun ? formatDateTime(schedule.nextRun) : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              <span>{schedule.inputs.length} inputs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              <span>{schedule.outputs.length} outputs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              <span>{schedule.notifications.enabled ? 'Notifications on' : 'Notifications off'}</span>
                            </div>
                            {schedule.scte35Enabled && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>SCTE-35 enabled</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {schedule.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {schedule.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{schedule.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  View your scheduled events in calendar format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Events for {selectedDate?.toLocaleDateString()}</h3>
                    <div className="space-y-2">
                      {schedules
                        .filter(schedule => {
                          if (!selectedDate) return false
                          const scheduleDate = new Date(schedule.startTime).toDateString()
                          return scheduleDate === selectedDate.toDateString()
                        })
                        .map((schedule) => (
                          <div key={schedule.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(schedule.type)}
                                <span className="font-medium text-sm">{schedule.name}</span>
                              </div>
                              {getStatusBadge(schedule.status)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(schedule.startTime).toLocaleTimeString()} - {new Date(schedule.endTime).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline View</CardTitle>
                <CardDescription>
                  Visual timeline of your scheduled events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    Timeline view would be implemented here with a visual timeline component
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}