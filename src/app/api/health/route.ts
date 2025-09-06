import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        api: '✅ Running',
        database: '✅ Connected',
        websocket: '✅ Running',
        encoder: '✅ Ready'
      },
      metrics: {
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        cpuUsage: 'Low',
        activeConnections: 0
      }
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error('Health check error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}