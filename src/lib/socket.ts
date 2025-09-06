import { Server } from 'socket.io';
import { db } from '@/lib/db';

export interface StreamStatusUpdate {
  streamId: string;
  status: 'IDLE' | 'ENCODING' | 'ERROR' | 'STOPPING';
  progress?: number;
  inputBytes?: number;
  outputBytes?: number;
  bitrate?: number;
  resolution?: string;
  timestamp: Date;
}

export interface AdBreakUpdate {
  adBreakId: string;
  status: 'SCHEDULED' | 'TRIGGERED' | 'COMPLETED' | 'CANCELLED';
  triggeredAt?: Date;
  completedAt?: Date;
  timestamp: Date;
}

export interface SystemLogUpdate {
  id: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  component?: string;
  timestamp: Date;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join streaming room for real-time updates
    socket.join('streaming-updates');
    
    // Handle stream status subscription
    socket.on('subscribe-streams', async () => {
      try {
        // Send current streams status
        const streams = await db.stream.findMany({
          include: {
            encodingSessions: {
              orderBy: { startTime: 'desc' },
              take: 1
            },
            adBreaks: {
              orderBy: { scheduledTime: 'asc' },
              where: { status: 'SCHEDULED' }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        socket.emit('streams-status', {
          streams,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error sending streams status:', error);
        socket.emit('error', { message: 'Failed to fetch streams status' });
      }
    });
    
    // Handle ad breaks subscription
    socket.on('subscribe-adbreaks', async () => {
      try {
        // Send current ad breaks status
        const adBreaks = await db.adBreak.findMany({
          include: {
            stream: {
              select: {
                id: true,
                name: true,
                inputUrl: true,
                outputUrl: true
              }
            }
          },
          orderBy: { scheduledTime: 'desc' }
        });
        
        socket.emit('adbreaks-status', {
          adBreaks,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error sending ad breaks status:', error);
        socket.emit('error', { message: 'Failed to fetch ad breaks status' });
      }
    });
    
    // Handle system logs subscription
    socket.on('subscribe-logs', async () => {
      try {
        // Send recent system logs
        const logs = await db.systemLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50
        });
        
        socket.emit('system-logs', {
          logs,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error sending system logs:', error);
        socket.emit('error', { message: 'Failed to fetch system logs' });
      }
    });
    
    // Handle stream control commands
    socket.on('start-encoding', async (data: { streamId: string }) => {
      try {
        // Check if stream exists
        const stream = await db.stream.findUnique({
          where: { id: data.streamId }
        });
        
        if (!stream) {
          socket.emit('error', { message: 'Stream not found' });
          return;
        }
        
        // Check if already encoding
        const activeSession = await db.encodingSession.findFirst({
          where: {
            streamId: data.streamId,
            status: {
              in: ['STARTING', 'RUNNING']
            }
          }
        });
        
        if (activeSession) {
          socket.emit('error', { message: 'Stream is already being encoded' });
          return;
        }
        
        // Create encoding session
        const encodingSession = await db.encodingSession.create({
          data: {
            streamId: data.streamId,
            status: 'STARTING'
          }
        });
        
        // Update stream status
        await db.stream.update({
          where: { id: data.streamId },
          data: { status: 'ENCODING' }
        });
        
        // Broadcast stream status update
        const statusUpdate: StreamStatusUpdate = {
          streamId: data.streamId,
          status: 'ENCODING',
          timestamp: new Date()
        };
        
        io.to('streaming-updates').emit('stream-status-update', statusUpdate);
        
        // Log the action
        await db.systemLog.create({
          data: {
            level: 'INFO',
            message: `Started encoding for stream ${data.streamId}`,
            component: 'websocket'
          }
        });
        
        socket.emit('encoding-started', {
          sessionId: encodingSession.id,
          streamId: data.streamId
        });
        
      } catch (error) {
        console.error('Error starting encoding:', error);
        socket.emit('error', { message: 'Failed to start encoding' });
      }
    });
    
    socket.on('stop-encoding', async (data: { streamId: string }) => {
      try {
        // Find active encoding session
        const activeSession = await db.encodingSession.findFirst({
          where: {
            streamId: data.streamId,
            status: {
              in: ['STARTING', 'RUNNING']
            }
          }
        });
        
        if (!activeSession) {
          socket.emit('error', { message: 'No active encoding session found' });
          return;
        }
        
        // Update encoding session status
        await db.encodingSession.update({
          where: { id: activeSession.id },
          data: {
            status: 'STOPPING',
            endTime: new Date()
          }
        });
        
        // Update stream status
        await db.stream.update({
          where: { id: data.streamId },
          data: { status: 'STOPPING' }
        });
        
        // Broadcast stream status update
        const statusUpdate: StreamStatusUpdate = {
          streamId: data.streamId,
          status: 'STOPPING',
          timestamp: new Date()
        };
        
        io.to('streaming-updates').emit('stream-status-update', statusUpdate);
        
        // Log the action
        await db.systemLog.create({
          data: {
            level: 'INFO',
            message: `Stopped encoding for stream ${data.streamId}`,
            component: 'websocket'
          }
        });
        
        socket.emit('encoding-stopped', {
          sessionId: activeSession.id,
          streamId: data.streamId
        });
        
      } catch (error) {
        console.error('Error stopping encoding:', error);
        socket.emit('error', { message: 'Failed to stop encoding' });
      }
    });
    
    // Handle ad break scheduling
    socket.on('schedule-adbreak', async (data: {
      streamId: string;
      scheduledTime: string;
      duration: number;
      adId: string;
      name?: string;
      description?: string;
    }) => {
      try {
        // Check if stream exists
        const stream = await db.stream.findUnique({
          where: { id: data.streamId }
        });
        
        if (!stream) {
          socket.emit('error', { message: 'Stream not found' });
          return;
        }
        
        // Create ad break
        const adBreak = await db.adBreak.create({
          data: {
            streamId: data.streamId,
            scheduledTime: new Date(data.scheduledTime),
            duration: data.duration,
            adId: data.adId,
            name: data.name,
            description: data.description
          }
        });
        
        // Broadcast ad break update
        const adBreakUpdate: AdBreakUpdate = {
          adBreakId: adBreak.id,
          status: 'SCHEDULED',
          timestamp: new Date()
        };
        
        io.to('streaming-updates').emit('adbreak-update', adBreakUpdate);
        
        // Log the action
        await db.systemLog.create({
          data: {
            level: 'INFO',
            message: `Scheduled ad break ${data.adId} for stream ${data.streamId}`,
            component: 'websocket'
          }
        });
        
        socket.emit('adbreak-scheduled', {
          adBreakId: adBreak.id,
          streamId: data.streamId
        });
        
      } catch (error) {
        console.error('Error scheduling ad break:', error);
        socket.emit('error', { message: 'Failed to schedule ad break' });
      }
    });
    
    // Handle system status requests
    socket.on('get-system-status', async () => {
      try {
        const streams = await db.stream.findMany();
        const encodingSessions = await db.encodingSession.findMany({
          where: { status: { in: ['STARTING', 'RUNNING'] } }
        });
        const scheduledAdBreaks = await db.adBreak.findMany({
          where: { status: 'SCHEDULED' }
        });
        
        const systemStatus = {
          totalStreams: streams.length,
          activeStreams: streams.filter(s => s.status === 'ENCODING').length,
          activeEncodingSessions: encodingSessions.length,
          scheduledAdBreaks: scheduledAdBreaks.length,
          timestamp: new Date()
        };
        
        socket.emit('system-status', systemStatus);
        
      } catch (error) {
        console.error('Error getting system status:', error);
        socket.emit('error', { message: 'Failed to get system status' });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave('streaming-updates');
    });
    
    // Send welcome message
    socket.emit('message', {
      text: 'Connected to Live Streaming Encoder WebSocket',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Helper functions to broadcast updates from other parts of the application
export const broadcastStreamUpdate = (io: Server, update: StreamStatusUpdate) => {
  io.to('streaming-updates').emit('stream-status-update', update);
};

export const broadcastAdBreakUpdate = (io: Server, update: AdBreakUpdate) => {
  io.to('streaming-updates').emit('adbreak-update', update);
};

export const broadcastSystemLog = (io: Server, log: SystemLogUpdate) => {
  io.to('streaming-updates').emit('system-log', log);
};