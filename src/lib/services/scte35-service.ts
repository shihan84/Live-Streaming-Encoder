import { db } from '@/lib/db'

export interface SCTE35Marker {
  id: string
  streamId: string
  adBreakId: string
  type: 'splice_insert' | 'time_signal'
  position: number
  duration: number
  providerId: string
  providerName: string
  autoReturn: boolean
  autoReturnDuration: number
  scteEventId: number
  cueType: 'CUE-OUT' | 'CUE-IN'
  preRollDuration: number
  crashOut: boolean
  scte35Pid: number
  data: string
  timestamp: Date
}

export interface AdBreakSchedule {
  id: string
  streamId: string
  name?: string
  scheduledTime: Date
  duration: number
  adId: string
  description?: string
  providerName: string
  providerId: string
  autoReturn: number
  status: string
  scteEventId?: number
  cueType: 'CUE-OUT' | 'CUE-IN'
  preRollDuration: number
  crashOut: boolean
  scte35Pid: number
}

export class SCTE35Service {
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map()
  private nextEventId: number = 100000 // Starting event ID

  async generateSpliceInsertMarker(adBreak: AdBreakSchedule): Promise<SCTE35Marker> {
    try {
      // Generate sequential SCTE event ID
      const scteEventId = this.getNextEventId()

      // Generate SCTE-35 splice_insert command
      // This is a simplified version - in production, you'd use the threefive library
      const spliceInsert = {
        splice_event_id: scteEventId,
        splice_event_cancel_indicator: false,
        out_of_network_indicator: true,
        program_splice_flag: true,
        duration_flag: true,
        splice_immediate_flag: false,
        components: [],
        break_duration: {
          auto_return: true,
          duration: adBreak.duration * 90000 // Convert to 90kHz clock
        },
        unique_program_id: 1,
        avail_num: 1,
        avails_expected: 1,
        segmentation_descriptor: {
          segmentation_type_id: adBreak.cueType === 'CUE-OUT' ? 0x22 : 0x23, // Program Start/End
          segmentation_duration: adBreak.duration * 90000,
          segmentation_upid_type: 0x08, // URI
          segmentation_upid_length: adBreak.adId.length,
          segmentation_upid: adBreak.adId,
          segmentation_type_id: adBreak.cueType === 'CUE-OUT' ? 0x22 : 0x23
        }
      }

      // Convert to base64-encoded SCTE-35 data
      const scte35Data = this.encodeSCTE35Data(spliceInsert)

      const marker: SCTE35Marker = {
        id: this.generateMarkerId(),
        streamId: adBreak.streamId,
        adBreakId: adBreak.id,
        type: 'splice_insert',
        position: 0, // Will be set when inserted into stream
        duration: adBreak.duration,
        providerId: adBreak.providerId,
        providerName: adBreak.providerName,
        autoReturn: true,
        autoReturnDuration: adBreak.autoReturn,
        scteEventId,
        cueType: adBreak.cueType,
        preRollDuration: adBreak.preRollDuration,
        crashOut: adBreak.crashOut,
        scte35Pid: adBreak.scte35Pid,
        data: scte35Data,
        timestamp: new Date()
      }

      // Store the marker in the database
      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Generated SCTE-35 splice_insert marker for ad break ${adBreak.id} - Event ID: ${scteEventId}, Cue Type: ${adBreak.cueType}`,
          component: 'scte35',
          metadata: JSON.stringify(marker)
        }
      })

      return marker
    } catch (error) {
      console.error('Error generating SCTE-35 marker:', error)
      throw error
    }
  }

  async generateTimeSignalMarker(adBreak: AdBreakSchedule): Promise<SCTE35Marker> {
    try {
      // Generate sequential SCTE event ID
      const scteEventId = this.getNextEventId()

      // Generate SCTE-35 time_signal command
      const timeSignal = {
        splice_event_id: scteEventId,
        splice_event_cancel_indicator: false,
        out_of_network_indicator: true,
        program_splice_flag: true,
        duration_flag: true,
        splice_immediate_flag: false,
        components: [],
        break_duration: {
          auto_return: true,
          duration: adBreak.duration * 90000 // Convert to 90kHz clock
        },
        unique_program_id: 1,
        avail_num: 1,
        avails_expected: 1,
        segmentation_descriptor: {
          segmentation_type_id: adBreak.cueType === 'CUE-OUT' ? 0x22 : 0x23,
          segmentation_duration: adBreak.duration * 90000,
          segmentation_upid_type: 0x08,
          segmentation_upid_length: adBreak.adId.length,
          segmentation_upid: adBreak.adId,
          segmentation_type_id: adBreak.cueType === 'CUE-OUT' ? 0x22 : 0x23
        }
      }

      const scte35Data = this.encodeSCTE35Data(timeSignal)

      const marker: SCTE35Marker = {
        id: this.generateMarkerId(),
        streamId: adBreak.streamId,
        adBreakId: adBreak.id,
        type: 'time_signal',
        position: 0,
        duration: adBreak.duration,
        providerId: adBreak.providerId,
        providerName: adBreak.providerName,
        autoReturn: true,
        autoReturnDuration: adBreak.autoReturn,
        scteEventId,
        cueType: adBreak.cueType,
        preRollDuration: adBreak.preRollDuration,
        crashOut: adBreak.crashOut,
        scte35Pid: adBreak.scte35Pid,
        data: scte35Data,
        timestamp: new Date()
      }

      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Generated SCTE-35 time_signal marker for ad break ${adBreak.id} - Event ID: ${scteEventId}, Cue Type: ${adBreak.cueType}`,
          component: 'scte35',
          metadata: JSON.stringify(marker)
        }
      })

      return marker
    } catch (error) {
      console.error('Error generating SCTE-35 time signal marker:', error)
      throw error
    }
  }

  async scheduleAdBreak(adBreak: AdBreakSchedule): Promise<void> {
    try {
      const now = new Date()
      const scheduledTime = new Date(adBreak.scheduledTime)
      const delay = scheduledTime.getTime() - now.getTime()

      if (delay <= 0) {
        throw new Error('Scheduled time must be in the future')
      }

      // Schedule the ad break
      const timeout = setTimeout(async () => {
        await this.triggerAdBreak(adBreak)
      }, delay)

      this.scheduledJobs.set(adBreak.id, timeout)

      // Update ad break status
      await db.adBreak.update({
        where: { id: adBreak.id },
        data: { status: 'SCHEDULED' }
      })

      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Scheduled ad break ${adBreak.id} for ${scheduledTime.toISOString()}`,
          component: 'scte35',
          metadata: JSON.stringify({ adBreakId: adBreak.id, scheduledTime, delay })
        }
      })
    } catch (error) {
      console.error('Error scheduling ad break:', error)
      throw error
    }
  }

  async cancelScheduledAdBreak(adBreakId: string): Promise<void> {
    try {
      const timeout = this.scheduledJobs.get(adBreakId)
      if (timeout) {
        clearTimeout(timeout)
        this.scheduledJobs.delete(adBreakId)
      }

      await db.adBreak.update({
        where: { id: adBreakId },
        data: { status: 'CANCELLED' }
      })

      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Cancelled scheduled ad break ${adBreakId}`,
          component: 'scte35'
        }
      })
    } catch (error) {
      console.error('Error cancelling scheduled ad break:', error)
      throw error
    }
  }

  private async triggerAdBreak(adBreak: AdBreakSchedule): Promise<void> {
    try {
      // Generate SCTE-35 marker for CUE-OUT
      const cueOutMarker = await this.generateSpliceInsertMarker({
        ...adBreak,
        cueType: 'CUE-OUT'
      })

      // Update ad break status and store event ID
      await db.adBreak.update({
        where: { id: adBreak.id },
        data: {
          status: 'TRIGGERED',
          triggeredAt: new Date(),
          scte35Data: cueOutMarker.data,
          scteEventId: cueOutMarker.scteEventId
        }
      })

      // Remove from scheduled jobs
      this.scheduledJobs.delete(adBreak.id)

      // Schedule the CUE-IN marker (return)
      const returnTimeout = setTimeout(async () => {
        await this.triggerAdBreakReturn(adBreak)
      }, (adBreak.duration + adBreak.preRollDuration) * 1000)

      this.scheduledJobs.set(`${adBreak.id}_return`, returnTimeout)

      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Triggered SCTE-35 CUE-OUT for ad break ${adBreak.id} - Event ID: ${cueOutMarker.scteEventId}`,
          component: 'scte35',
          metadata: JSON.stringify({ marker: cueOutMarker, adBreak })
        }
      })
    } catch (error) {
      console.error('Error triggering ad break:', error)
      throw error
    }
  }

  private async triggerAdBreakReturn(adBreak: AdBreakSchedule): Promise<void> {
    try {
      // Generate SCTE-35 marker for CUE-IN
      const cueInMarker = await this.generateSpliceInsertMarker({
        ...adBreak,
        cueType: 'CUE-IN',
        duration: 0 // Return marker has 0 duration
      })

      // Update ad break status
      await db.adBreak.update({
        where: { id: adBreak.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Remove from scheduled jobs
      this.scheduledJobs.delete(`${adBreak.id}_return`)

      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Triggered SCTE-35 CUE-IN for ad break ${adBreak.id} - Event ID: ${cueInMarker.scteEventId}`,
          component: 'scte35',
          metadata: JSON.stringify({ marker: cueInMarker, adBreak })
        }
      })
    } catch (error) {
      console.error('Error triggering ad break return:', error)
      throw error
    }
  }

  async triggerCrashOut(adBreakId: string): Promise<void> {
    try {
      const adBreak = await db.adBreak.findUnique({
        where: { id: adBreakId }
      })

      if (!adBreak) {
        throw new Error('Ad break not found')
      }

      // Cancel any scheduled return
      const returnTimeout = this.scheduledJobs.get(`${adBreakId}_return`)
      if (returnTimeout) {
        clearTimeout(returnTimeout)
        this.scheduledJobs.delete(`${adBreakId}_return`)
      }

      // Generate immediate CUE-IN marker
      const cueInMarker = await this.generateSpliceInsertMarker({
        ...adBreak,
        cueType: 'CUE-IN',
        duration: 0,
        crashOut: true
      })

      // Update ad break status
      await db.adBreak.update({
        where: { id: adBreakId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      await db.systemLog.create({
        data: {
          level: 'WARN',
          message: `Triggered SCTE-35 crash out CUE-IN for ad break ${adBreakId} - Event ID: ${cueInMarker.scteEventId}`,
          component: 'scte35',
          metadata: JSON.stringify({ marker: cueInMarker, adBreak })
        }
      })
    } catch (error) {
      console.error('Error triggering crash out:', error)
      throw error
    }
  }

  private getNextEventId(): number {
    return this.nextEventId++
  }

  private generateMarkerId(): string {
    return `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private encodeSCTE35Data(data: any): string {
    // This is a simplified version - in production, you'd use the threefive library
    // to properly encode SCTE-35 data according to the specification
    const jsonString = JSON.stringify(data)
    return Buffer.from(jsonString).toString('base64')
  }

  async getScheduledAdBreaks(): Promise<AdBreakSchedule[]> {
    try {
      const adBreaks = await db.adBreak.findMany({
        where: { status: 'SCHEDULED' },
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
        orderBy: { scheduledTime: 'asc' }
      })

      return adBreaks.map(adBreak => ({
        id: adBreak.id,
        streamId: adBreak.streamId,
        name: adBreak.name,
        scheduledTime: adBreak.scheduledTime,
        duration: adBreak.duration,
        adId: adBreak.adId,
        description: adBreak.description,
        providerName: adBreak.providerName,
        providerId: adBreak.providerId,
        autoReturn: adBreak.autoReturn,
        status: adBreak.status
      }))
    } catch (error) {
      console.error('Error getting scheduled ad breaks:', error)
      throw error
    }
  }

  async getActiveAdBreaks(): Promise<AdBreakSchedule[]> {
    try {
      const adBreaks = await db.adBreak.findMany({
        where: { status: 'TRIGGERED' },
        include: {
          stream: {
            select: {
              id: true,
              name: true,
              inputUrl: true,
              outputUrl: true
            }
          }
        }
      })

      return adBreaks.map(adBreak => ({
        id: adBreak.id,
        streamId: adBreak.streamId,
        name: adBreak.name,
        scheduledTime: adBreak.scheduledTime,
        duration: adBreak.duration,
        adId: adBreak.adId,
        description: adBreak.description,
        providerName: adBreak.providerName,
        providerId: adBreak.providerId,
        autoReturn: adBreak.autoReturn,
        status: adBreak.status
      }))
    } catch (error) {
      console.error('Error getting active ad breaks:', error)
      throw error
    }
  }
}

export const scte35Service = new SCTE35Service()