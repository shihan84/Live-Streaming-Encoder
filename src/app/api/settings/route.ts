import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get the first settings record or create default if none exists
    let settings = await db.systemSettings.findFirst()
    
    if (!settings) {
      settings = await db.systemSettings.create({
        data: {}
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      ffmpegPath,
      outputDirectory,
      segmentDuration,
      playlistSize,
      hlsTime,
      hlsListSize,
      hlsFlags,
      scte35Enabled
    } = body

    // Get existing settings or create default
    let settings = await db.systemSettings.findFirst()
    
    if (!settings) {
      settings = await db.systemSettings.create({
        data: {}
      })
    }

    const updateData: any = {}
    if (ffmpegPath !== undefined) updateData.ffmpegPath = ffmpegPath
    if (outputDirectory !== undefined) updateData.outputDirectory = outputDirectory
    if (segmentDuration !== undefined) updateData.segmentDuration = segmentDuration
    if (playlistSize !== undefined) updateData.playlistSize = playlistSize
    if (hlsTime !== undefined) updateData.hlsTime = hlsTime
    if (hlsListSize !== undefined) updateData.hlsListSize = hlsListSize
    if (hlsFlags !== undefined) updateData.hlsFlags = hlsFlags
    if (scte35Enabled !== undefined) updateData.scte35Enabled = scte35Enabled

    const updatedSettings = await db.systemSettings.update({
      where: { id: settings.id },
      data: updateData
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating system settings:', error)
    return NextResponse.json(
      { error: 'Failed to update system settings' },
      { status: 500 }
    )
  }
}