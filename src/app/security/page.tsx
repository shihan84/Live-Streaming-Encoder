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
  Shield, 
  Users, 
  Key, 
  Database, 
  Bell,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Server,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Activity,
  FileText
} from 'lucide-react'

export default function SecurityPage() {
  const breadcrumbItems = [
    { label: 'Security' }
  ]

  const [showPasswords, setShowPasswords] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)

  // Mock security data
  const users = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'administrator',
      status: 'active',
      lastLogin: '2024-01-15T14:30:00Z',
      twoFactorEnabled: true,
      permissions: ['all']
    },
    {
      id: 2,
      username: 'operator',
      email: 'operator@example.com',
      role: 'operator',
      status: 'active',
      lastLogin: '2024-01-15T13:45:00Z',
      twoFactorEnabled: false,
      permissions: ['channels.read', 'channels.write', 'monitoring.read']
    },
    {
      id: 3,
      username: 'viewer',
      email: 'viewer@example.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-10T09:00:00Z',
      twoFactorEnabled: false,
      permissions: ['monitoring.read']
    }
  ]

  const apiKeys = [
    {
      id: 'ak_1234567890abcdef',
      name: 'Mobile App Key',
      description: 'Key for mobile application access',
      permissions: ['channels.read', 'monitoring.read'],
      lastUsed: '2024-01-15T14:25:00Z',
      expiresAt: '2024-12-31T23:59:59Z',
      status: 'active'
    },
    {
      id: 'ak_0987654321fedcba',
      name: 'Integration Key',
      description: 'Key for third-party integration',
      permissions: ['channels.read', 'channels.write'],
      lastUsed: '2024-01-14T16:30:00Z',
      expiresAt: '2024-06-30T23:59:59Z',
      status: 'active'
    },
    {
      id: 'ak_abcdef1234567890',
      name: 'Deprecated Key',
      description: 'Old key that should be revoked',
      permissions: ['all'],
      lastUsed: '2024-01-01T00:00:00Z',
      expiresAt: '2024-01-31T23:59:59Z',
      status: 'expired'
    }
  ]

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-15T14:30:00Z',
      user: 'admin',
      action: 'login',
      resource: '/auth/login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      details: 'Successful login'
    },
    {
      id: 2,
      timestamp: '2024-01-15T14:25:00Z',
      user: 'operator',
      action: 'channel.create',
      resource: '/api/channels',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'success',
      details: 'Created new channel CH-004'
    },
    {
      id: 3,
      timestamp: '2024-01-15T14:20:00Z',
      user: 'unknown',
      action: 'login.failed',
      resource: '/auth/login',
      ipAddress: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      status: 'failed',
      details: 'Invalid credentials'
    }
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Badge className="bg-red-500">Administrator</Badge>
      case 'operator':
        return <Badge className="bg-blue-500">Operator</Badge>
      case 'viewer':
        return <Badge className="bg-green-500">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-500">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
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
            title="Security & Access Control" 
            subtitle="Manage users, API keys, and security settings"
          />
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage user accounts, roles, and permissions
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold">{user.username}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span>{getRoleBadge(user.role)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {user.twoFactorEnabled ? (
                                  <Lock className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Unlock className="h-4 w-4 text-red-600" />
                                )}
                                <span>2FA {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(user.status)}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              <strong>Permissions:</strong> {user.permissions.join(', ')}
                            </div>
                            <div className="flex gap-1">
                              {user.status === 'active' ? (
                                <Button variant="outline" size="sm">
                                  <UserX className="h-4 w-4 mr-1" />
                                  Deactivate
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </Button>
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
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            {/* API Key Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Key Management
                    </CardTitle>
                    <CardDescription>
                      Manage API keys for programmatic access to the system
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate API Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-semibold">{apiKey.name}</h3>
                              <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Key className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono">
                                  {showApiKeys ? apiKey.id : apiKey.id.substring(0, 8) + '...'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowApiKeys(!showApiKeys)}
                                >
                                  {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Expires: {new Date(apiKey.expiresAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(apiKey.status)}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              <strong>Permissions:</strong> {apiKey.permissions.join(', ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last used: {new Date(apiKey.lastUsed).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-logs" className="space-y-6">
            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Audit Logs
                    </CardTitle>
                    <CardDescription>
                      System activity and security event logs
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mt-0.5">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{log.action}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>User: {log.user}</span>
                          <span>IP: {log.ipAddress}</span>
                          <span>Resource: {log.resource}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}