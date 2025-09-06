import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { db } from '@/lib/db'

const execAsync = promisify(exec)

export interface FFmpegOptions {
  inputUrl: string
  outputUrl: string
  bitrate: number
  resolution: string
  preset: string
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
  scte35Enabled: boolean
  scte35Pid: number
  nullPid: number
  latency: number
  outputDirectory: string
  segmentDuration: number
  playlistSize: number
  hlsTime: number
  hlsListSize: number
  hlsFlags: string
}

export interface EncodingMetadata {
  streamId: string
  sessionId: string
  startTime: Date
  inputUrl: string
  outputUrl: string
  bitrate: number
  resolution: string
  scte35Enabled: boolean
  ffmpegCommand: string
  pid?: number
  logPath: string
}

export class StreamingEncoder {
  private activeProcesses: Map<string, any> = new Map()

  async startEncoding(streamId: string, sessionId: string, options: FFmpegOptions): Promise<EncodingMetadata> {
    try {
      // Create output directory if it doesn't exist
      await fs.mkdir(options.outputDirectory, { recursive: true })

      // Generate FFmpeg command
      const ffmpegCommand = this.buildFFmpegCommand(options, sessionId)

      // Create log file path
      const logPath = path.join(options.outputDirectory, `encoding_${sessionId}.log`)

      // Start FFmpeg process
      const process = spawn(ffmpegCommand.ffmpegPath, ffmpegCommand.args, {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      })

      // Store process reference
      this.activeProcesses.set(sessionId, process)

      // Create log file and redirect output
      const logFile = await fs.open(logPath, 'w')
      process.stdout?.pipe(logFile.createWriteStream())
      process.stderr?.pipe(logFile.createWriteStream())

      // Handle process events
      process.on('exit', async (code, signal) => {
        await this.handleProcessExit(sessionId, code, signal)
      })

      process.on('error', async (error) => {
        await this.handleProcessError(sessionId, error)
      })

      const metadata: EncodingMetadata = {
        streamId,
        sessionId,
        startTime: new Date(),
        inputUrl: options.inputUrl,
        outputUrl: options.outputUrl,
        bitrate: options.bitrate,
        resolution: options.resolution,
        scte35Enabled: options.scte35Enabled,
        ffmpegCommand: ffmpegCommand.fullCommand,
        pid: process.pid,
        logPath
      }

      // Update encoding session with process details
      await db.encodingSession.update({
        where: { id: sessionId },
        data: {
          status: 'RUNNING',
          pid: process.pid,
          logPath
        }
      })

      // Log the start of encoding
      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Started encoding session ${sessionId} for stream ${streamId}`,
          component: 'encoder',
          metadata: JSON.stringify(metadata)
        }
      })

      return metadata
    } catch (error) {
      console.error('Error starting encoding:', error)
      throw error
    }
  }

  async stopEncoding(sessionId: string): Promise<void> {
    try {
      const process = this.activeProcesses.get(sessionId)
      if (process) {
        // Send SIGTERM to gracefully stop the process
        process.kill('SIGTERM')
        
        // Wait a bit for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // If still running, force kill
        if (this.activeProcesses.has(sessionId)) {
          process.kill('SIGKILL')
        }
        
        this.activeProcesses.delete(sessionId)
      }

      // Update encoding session
      await db.encodingSession.update({
        where: { id: sessionId },
        data: {
          status: 'STOPPING',
          endTime: new Date()
        }
      })

      // Log the stop
      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Stopped encoding session ${sessionId}`,
          component: 'encoder'
        }
      })
    } catch (error) {
      console.error('Error stopping encoding:', error)
      throw error
    }
  }

  private buildFFmpegCommand(options: FFmpegOptions, sessionId: string): {
    ffmpegPath: string
    args: string[]
    fullCommand: string
  } {
    const ffmpegPath = '/usr/local/bin/ffmpeg' // Default path, should be configurable
    
    const args = [
      '-i', options.inputUrl,
      
      // Video codec settings
      '-c:v', 'libx264',
      '-preset', options.preset,
      '-profile:v', options.profile,
      '-b:v', `${options.bitrate}k`,
      '-maxrate', `${options.bitrate * 1.5}k`,
      '-bufsize', `${options.bitrate * 2}k`,
      '-s', options.resolution,
      '-aspect', options.aspectRatio,
      '-g', options.keyframeInterval.toString(),
      '-keyint_min', options.keyframeInterval.toString(),
      '-bf', options.bFrames.toString(),
      '-pix_fmt', `yuv${options.chroma.replace(':', '')}p`,
      '-sc_threshold', '0',
      
      // PCR settings
      '-pcr_period', '20', // 20ms PCR period
      '-mpegts_pcr_start', '0',
      
      // Audio codec settings
      '-c:a', 'aac',
      '-profile:a', 'aac_low',
      '-b:a', `${options.audioBitrate}k`,
      '-ar', options.audioSampleRate.toString(),
      '-af', `volume=${Math.pow(10, options.audioLKFS / 20)}`, // Convert LKFS to linear scale
      
      // SCTE-35 settings
      '-scte35_pid', options.scte35Pid.toString(),
      '-mpegts_null_pid', options.nullPid.toString(),
      
      // Transport stream settings
      '-f', 'mpegts',
      '-mpegts_transport_stream_id', '1',
      '-mpegts_original_network_id', '1',
      '-mpegts_service_id', '1',
      '-mpegts_service_type', 'digital_tv',
      '-mpegts_pmt_start_pid', '16',
      '-mpegts_start_pid', '256',
      
      // Latency settings for SRT
      '-flush_packets', '1',
      '-fflags', '+genpts+ignidx',
      
      // Output
      `${options.outputUrl}`
    ]

    // Add SCTE-35 specific arguments if enabled
    if (options.scte35Enabled) {
      args.splice(args.indexOf('-f'), 0, '-scte35_from_stream', 'true')
    }

    const fullCommand = `${ffmpegPath} ${args.join(' ')}`

    return { ffmpegPath, args, fullCommand }
  }

  private async handleProcessExit(sessionId: string, code: number | null, signal: string | null): Promise<void> {
    try {
      this.activeProcesses.delete(sessionId)

      const status = code === 0 ? 'COMPLETED' : 'ERROR'
      
      await db.encodingSession.update({
        where: { id: sessionId },
        data: {
          status,
          endTime: new Date(),
          progress: 100
        }
      })

      await db.systemLog.create({
        data: {
          level: code === 0 ? 'INFO' : 'ERROR',
          message: `Encoding session ${sessionId} ${status.toLowerCase()} (code: ${code}, signal: ${signal})`,
          component: 'encoder'
        }
      })
    } catch (error) {
      console.error('Error handling process exit:', error)
    }
  }

  private async handleProcessError(sessionId: string, error: Error): Promise<void> {
    try {
      this.activeProcesses.delete(sessionId)

      await db.encodingSession.update({
        where: { id: sessionId },
        data: {
          status: 'ERROR',
          endTime: new Date()
        }
      })

      await db.systemLog.create({
        data: {
          level: 'ERROR',
          message: `Encoding session ${sessionId} error: ${error.message}`,
          component: 'encoder'
        }
      })
    } catch (error) {
      console.error('Error handling process error:', error)
    }
  }

  async getEncodingStatus(sessionId: string): Promise<{
    status: string
    progress: number
    inputBytes: number
    outputBytes: number
    isRunning: boolean
  }> {
    try {
      const session = await db.encodingSession.findUnique({
        where: { id: sessionId }
      })

      if (!session) {
        throw new Error('Encoding session not found')
      }

      const isRunning = this.activeProcesses.has(sessionId)

      return {
        status: session.status,
        progress: session.progress,
        inputBytes: session.inputBytes,
        outputBytes: session.outputBytes,
        isRunning
      }
    } catch (error) {
      console.error('Error getting encoding status:', error)
      throw error
    }
  }

  async getActiveSessions(): Promise<string[]> {
    return Array.from(this.activeProcesses.keys())
  }
}

export const streamingEncoder = new StreamingEncoder()