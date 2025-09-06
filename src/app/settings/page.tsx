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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Server, 
  Database, 
  Wifi, 
  Shield, 
  Users, 
  Bell,
  Monitor,
  Film,
  Globe,
  Key,
  HardDrive,
  Cpu,
  Zap,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const breadcrumbItems = [
    { label: 'Settings' }
  ]

  const [showPasswords, setShowPasswords] = useState(false)

  // Mock settings data
  const generalSettings = {
    siteName: 'Live Streaming Encoder',
    siteDescription: 'Professional live streaming encoder with SCTE-35 support',
    adminEmail: 'admin@example.com',
    timezone: 'UTC',
    language: 'en',
    maintenanceMode: false,
    debugMode: false
  }

  const encodingSettings = {
    defaultPreset: 'medium',
    defaultCodec: 'h264',
    defaultProfile: 'high',
    defaultTune: 'none',
    maxConcurrentEncodes: 5,
    defaultGopSize: 60,
    defaultKeyframeInterval: 2,
    hardwareAcceleration: true,
    ffmpegPath: '/usr/local/bin/ffmpeg',
    outputDirectory: '/var/www/hls'
  }

  const networkSettings = {
    inputPort: 1935,
    outputPort: 8080,
    apiPort: 3000,
    websocketPort: 3001,
    sslEnabled: true,
    sslCertPath: '/etc/ssl/certs/cert.pem',
    sslKeyPath: '/etc/ssl/certs/key.pem',
    allowedOrigins: ['*'],
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100
    }
  }

  const storageSettings = {
    storageType: 'local',
    storagePath: '/var/www/hls',
    maxStorageSize: 1000, // GB
    retentionDays: 30,
    autoCleanup: true,
    backupEnabled: true,
    backupSchedule: 'daily',
    backupRetention: 7
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Header 
            title="System Settings" 
            subtitle="Configure system-wide settings and preferences"
          />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="encoding">Encoding</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic system configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      defaultValue={generalSettings.siteName}
                      placeholder="Live Streaming Encoder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email"
                      defaultValue={generalSettings.adminEmail}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea 
                    id="siteDescription" 
                    defaultValue={generalSettings.siteDescription}
                    placeholder="Site description..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue={generalSettings.timezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue={generalSettings.language}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenanceMode" defaultChecked={generalSettings.maintenanceMode} />
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="debugMode" defaultChecked={generalSettings.debugMode} />
                    <Label htmlFor="debugMode">Debug Mode</Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encoding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Encoding Settings
                </CardTitle>
                <CardDescription>
                  Configure video encoding parameters and FFmpeg settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPreset">Default Preset</Label>
                    <Select defaultValue={encodingSettings.defaultPreset}>
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
                    <Label htmlFor="defaultCodec">Default Codec</Label>
                    <Select defaultValue={encodingSettings.defaultCodec}>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultProfile">Default Profile</Label>
                    <Select defaultValue={encodingSettings.defaultProfile}>
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
                  <div className="space-y-2">
                    <Label htmlFor="defaultTune">Default Tune</Label>
                    <Select defaultValue={encodingSettings.defaultTune}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tune" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="film">Film</SelectItem>
                        <SelectItem value="animation">Animation</SelectItem>
                        <SelectItem value="grain">Grain</SelectItem>
                        <SelectItem value="stillimage">Still Image</SelectItem>
                        <SelectItem value="fastdecode">Fast Decode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrentEncodes">Max Concurrent Encodes</Label>
                    <Input 
                      id="maxConcurrentEncodes" 
                      type="number"
                      defaultValue={encodingSettings.maxConcurrentEncodes}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultGopSize">Default GOP Size</Label>
                    <Input 
                      id="defaultGopSize" 
                      type="number"
                      defaultValue={encodingSettings.defaultGopSize}
                      min="1"
                      max="600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultKeyframeInterval">Default Keyframe Interval (s)</Label>
                    <Input 
                      id="defaultKeyframeInterval" 
                      type="number"
                      defaultValue={encodingSettings.defaultKeyframeInterval}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ffmpegPath">FFmpeg Path</Label>
                    <Input 
                      id="ffmpegPath" 
                      defaultValue={encodingSettings.ffmpegPath}
                      placeholder="/usr/local/bin/ffmpeg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outputDirectory">Output Directory</Label>
                    <Input 
                      id="outputDirectory" 
                      defaultValue={encodingSettings.outputDirectory}
                      placeholder="/var/www/hls"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="hardwareAcceleration" defaultChecked={encodingSettings.hardwareAcceleration} />
                  <Label htmlFor="hardwareAcceleration">Enable Hardware Acceleration</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Network Settings
                </CardTitle>
                <CardDescription>
                  Configure network ports, SSL, and connectivity settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inputPort">Input Port</Label>
                    <Input 
                      id="inputPort" 
                      type="number"
                      defaultValue={networkSettings.inputPort}
                      min="1"
                      max="65535"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outputPort">Output Port</Label>
                    <Input 
                      id="outputPort" 
                      type="number"
                      defaultValue={networkSettings.outputPort}
                      min="1"
                      max="65535"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiPort">API Port</Label>
                    <Input 
                      id="apiPort" 
                      type="number"
                      defaultValue={networkSettings.apiPort}
                      min="1"
                      max="65535"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websocketPort">WebSocket Port</Label>
                    <Input 
                      id="websocketPort" 
                      type="number"
                      defaultValue={networkSettings.websocketPort}
                      min="1"
                      max="65535"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="sslEnabled" defaultChecked={networkSettings.sslEnabled} />
                  <Label htmlFor="sslEnabled">Enable SSL/TLS</Label>
                </div>
                
                {networkSettings.sslEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sslCertPath">SSL Certificate Path</Label>
                      <Input 
                        id="sslCertPath" 
                        defaultValue={networkSettings.sslCertPath}
                        placeholder="/etc/ssl/certs/cert.pem"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sslKeyPath">SSL Key Path</Label>
                      <Input 
                        id="sslKeyPath" 
                        defaultValue={networkSettings.sslKeyPath}
                        placeholder="/etc/ssl/certs/key.pem"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="allowedOrigins">Allowed Origins (comma-separated)</Label>
                  <Input 
                    id="allowedOrigins" 
                    defaultValue={networkSettings.allowedOrigins.join(', ')}
                    placeholder="*, https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rate Limiting</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="rateLimiting" 
                      defaultChecked={networkSettings.rateLimiting.enabled} 
                    />
                    <Label htmlFor="rateLimiting">Enable Rate Limiting</Label>
                  </div>
                  {networkSettings.rateLimiting.enabled && (
                    <div className="mt-2">
                      <Label htmlFor="requestsPerMinute">Requests per Minute</Label>
                      <Input 
                        id="requestsPerMinute" 
                        type="number"
                        defaultValue={networkSettings.rateLimiting.requestsPerMinute}
                        min="1"
                        max="10000"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage Settings
                </CardTitle>
                <CardDescription>
                  Configure storage paths, retention policies, and backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storageType">Storage Type</Label>
                    <Select defaultValue={storageSettings.storageType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="s3">Amazon S3</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storagePath">Storage Path</Label>
                    <Input 
                      id="storagePath" 
                      defaultValue={storageSettings.storagePath}
                      placeholder="/var/www/hls"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStorageSize">Max Storage Size (GB)</Label>
                    <Input 
                      id="maxStorageSize" 
                      type="number"
                      defaultValue={storageSettings.maxStorageSize}
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Retention Days</Label>
                    <Input 
                      id="retentionDays" 
                      type="number"
                      defaultValue={storageSettings.retentionDays}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="autoCleanup" defaultChecked={storageSettings.autoCleanup} />
                  <Label htmlFor="autoCleanup">Enable Auto Cleanup</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Backup Settings</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="backupEnabled" defaultChecked={storageSettings.backupEnabled} />
                    <Label htmlFor="backupEnabled">Enable Backups</Label>
                  </div>
                  {storageSettings.backupEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="backupSchedule">Backup Schedule</Label>
                        <Select defaultValue={storageSettings.backupSchedule}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                        <Input 
                          id="backupRetention" 
                          type="number"
                          defaultValue={storageSettings.backupRetention}
                          min="1"
                          max="365"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure authentication, authorization, and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <div className="relative">
                    <Input 
                      id="adminPassword" 
                      type={showPasswords ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type={showPasswords ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    defaultValue="30"
                    min="5"
                    max="1440"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="20"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactorAuth" />
                  <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="ipWhitelist" />
                  <Label htmlFor="ipWhitelist">Enable IP Whitelist</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedIPs">Allowed IPs (comma-separated)</Label>
                  <Textarea 
                    id="allowedIPs" 
                    placeholder="192.168.1.0/24, 10.0.0.0/8"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="auditLogging" defaultChecked />
                  <Label htmlFor="auditLogging">Enable Audit Logging</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}