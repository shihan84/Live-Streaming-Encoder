'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { 
  StreamStatusUpdate, 
  AdBreakUpdate, 
  SystemLogUpdate,
  broadcastStreamUpdate,
  broadcastAdBreakUpdate,
  broadcastSystemLog
} from '@/lib/socket'

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
}

interface WebSocketState {
  isConnected: boolean
  streams: any[]
  adBreaks: any[]
  systemLogs: any[]
  systemStatus: any
  error: string | null
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', autoConnect = true } = options
  const socketRef = useRef<Socket | null>(null)
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    streams: [],
    adBreaks: [],
    systemLogs: [],
    systemStatus: null,
    error: null
  })

  useEffect(() => {
    if (!autoConnect) return

    const socket = io(url, {
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }))
      
      // Subscribe to all updates
      socket.emit('subscribe-streams')
      socket.emit('subscribe-adbreaks')
      socket.emit('subscribe-logs')
      socket.emit('get-system-status')
    })

    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }))
    })

    // Data events
    socket.on('streams-status', (data) => {
      setState(prev => ({ ...prev, streams: data.streams }))
    })

    socket.on('adbreaks-status', (data) => {
      setState(prev => ({ ...prev, adBreaks: data.adBreaks }))
    })

    socket.on('system-logs', (data) => {
      setState(prev => ({ ...prev, systemLogs: data.logs }))
    })

    socket.on('system-status', (data) => {
      setState(prev => ({ ...prev, systemStatus: data }))
    })

    // Real-time update events
    socket.on('stream-status-update', (update: StreamStatusUpdate) => {
      setState(prev => ({
        ...prev,
        streams: prev.streams.map(stream => 
          stream.id === update.streamId 
            ? { ...stream, status: update.status, ...update }
            : stream
        )
      }))
    })

    socket.on('adbreak-update', (update: AdBreakUpdate) => {
      setState(prev => ({
        ...prev,
        adBreaks: prev.adBreaks.map(adBreak => 
          adBreak.id === update.adBreakId 
            ? { ...adBreak, status: update.status, ...update }
            : adBreak
        )
      }))
    })

    socket.on('system-log', (log: SystemLogUpdate) => {
      setState(prev => ({
        ...prev,
        systemLogs: [log, ...prev.systemLogs].slice(0, 100) // Keep last 100 logs
      }))
    })

    // Error events
    socket.on('error', (error) => {
      setState(prev => ({ ...prev, error: error.message }))
    })

    // Response events
    socket.on('encoding-started', (data) => {
      console.log('Encoding started:', data)
    })

    socket.on('encoding-stopped', (data) => {
      console.log('Encoding stopped:', data)
    })

    socket.on('adbreak-scheduled', (data) => {
      console.log('Ad break scheduled:', data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [url, autoConnect])

  // Actions
  const startEncoding = async (streamId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('start-encoding', { streamId })
    }
  }

  const stopEncoding = async (streamId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('stop-encoding', { streamId })
    }
  }

  const scheduleAdBreak = async (data: {
    streamId: string
    scheduledTime: string
    duration: number
    adId: string
    name?: string
    description?: string
  }) => {
    if (socketRef.current) {
      socketRef.current.emit('schedule-adbreak', data)
    }
  }

  const refreshSystemStatus = async () => {
    if (socketRef.current) {
      socketRef.current.emit('get-system-status')
    }
  }

  const refreshStreams = async () => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe-streams')
    }
  }

  const refreshAdBreaks = async () => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe-adbreaks')
    }
  }

  const refreshLogs = async () => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe-logs')
    }
  }

  return {
    ...state,
    startEncoding,
    stopEncoding,
    scheduleAdBreak,
    refreshSystemStatus,
    refreshStreams,
    refreshAdBreaks,
    refreshLogs
  }
}

// Hook for specific stream updates
export function useStreamUpdates(streamId: string) {
  const [stream, setStream] = useState<any>(null)
  const { streams } = useWebSocket()

  useEffect(() => {
    const foundStream = streams.find(s => s.id === streamId)
    if (foundStream) {
      setStream(foundStream)
    }
  }, [streams, streamId])

  return stream
}

// Hook for specific ad break updates
export function useAdBreakUpdates(adBreakId: string) {
  const [adBreak, setAdBreak] = useState<any>(null)
  const { adBreaks } = useWebSocket()

  useEffect(() => {
    const foundAdBreak = adBreaks.find(ab => ab.id === adBreakId)
    if (foundAdBreak) {
      setAdBreak(foundAdBreak)
    }
  }, [adBreaks, adBreakId])

  return adBreak
}

// Hook for system logs with filtering
export function useSystemLogs(level?: string, component?: string) {
  const { systemLogs } = useWebSocket()

  const filteredLogs = systemLogs.filter(log => {
    if (level && log.level !== level) return false
    if (component && log.component !== component) return false
    return true
  })

  return filteredLogs
}