import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stream = await db.stream.findUnique({
      where: { id: params.id },
      include: {
        encodingSessions: {
          orderBy: { startTime: 'desc' }
        },
        adBreaks: {
          orderBy: { scheduledTime: 'desc' }
        }
      }
    })

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(stream)
  } catch (error) {
    console.error('Error fetching stream:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stream' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      inputUrl,
      outputUrl,
      bitrate,
      resolution,
      scte35Enabled,
      encoderPreset,
      gopSize,
      bFrames,
      profile,
      chroma,
      aspectRatio,
      keyframeInterval,
      pcr,
      audioCodec,
      audioBitrate,
      audioLKFS,
      audioSampleRate,
      scte35Pid,
      nullPid,
      latency,
      status,
      // Metadata fields
      description,
      genre,
      language,
      provider,
      network,
      channel,
      category,
      tags,
      customMetadata,
      epgId,
      contentRating,
      copyright,
      isLive,
      startTime,
      endTime
    } = body

    const existingStream = await db.stream.findUnique({
      where: { id: params.id }
    })

    if (!existingStream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    // Basic stream fields
    if (name !== undefined) updateData.name = name
    if (inputUrl !== undefined) updateData.inputUrl = inputUrl
    if (outputUrl !== undefined) updateData.outputUrl = outputUrl
    if (bitrate !== undefined) updateData.bitrate = bitrate
    if (resolution !== undefined) updateData.resolution = resolution
    if (scte35Enabled !== undefined) updateData.scte35Enabled = scte35Enabled
    if (encoderPreset !== undefined) updateData.encoderPreset = encoderPreset
    if (gopSize !== undefined) updateData.gopSize = gopSize
    if (bFrames !== undefined) updateData.bFrames = bFrames
    if (profile !== undefined) updateData.profile = profile
    if (chroma !== undefined) updateData.chroma = chroma
    if (aspectRatio !== undefined) updateData.aspectRatio = aspectRatio
    if (keyframeInterval !== undefined) updateData.keyframeInterval = keyframeInterval
    if (pcr !== undefined) updateData.pcr = pcr
    if (audioCodec !== undefined) updateData.audioCodec = audioCodec
    if (audioBitrate !== undefined) updateData.audioBitrate = audioBitrate
    if (audioLKFS !== undefined) updateData.audioLKFS = audioLKFS
    if (audioSampleRate !== undefined) updateData.audioSampleRate = audioSampleRate
    if (scte35Pid !== undefined) updateData.scte35Pid = scte35Pid
    if (nullPid !== undefined) updateData.nullPid = nullPid
    if (latency !== undefined) updateData.latency = latency
    if (status !== undefined) updateData.status = status
    
    // Metadata fields
    if (description !== undefined) updateData.description = description
    if (genre !== undefined) updateData.genre = genre
    if (language !== undefined) updateData.language = language
    if (provider !== undefined) updateData.provider = provider
    if (network !== undefined) updateData.network = network
    if (channel !== undefined) updateData.channel = channel
    if (category !== undefined) updateData.category = category
    if (epgId !== undefined) updateData.epgId = epgId
    if (contentRating !== undefined) updateData.contentRating = contentRating
    if (copyright !== undefined) updateData.copyright = copyright
    if (isLive !== undefined) updateData.isLive = isLive
    
    // Handle tags
    if (tags !== undefined) {
      if (typeof tags === 'string') {
        updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      } else if (Array.isArray(tags)) {
        updateData.tags = tags
      }
    }
    
    // Handle custom metadata
    if (customMetadata !== undefined) {
      try {
        if (typeof customMetadata === 'string') {
          updateData.customMetadata = JSON.stringify(JSON.parse(customMetadata))
        } else {
          updateData.customMetadata = JSON.stringify(customMetadata)
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid custom metadata JSON format' },
          { status: 400 }
        )
      }
    }
    
    // Handle date fields
    if (startTime !== undefined) {
      const parsedStartTime = new Date(startTime)
      if (isNaN(parsedStartTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start time format' },
          { status: 400 }
        )
      }
      updateData.startTime = parsedStartTime
    }
    
    if (endTime !== undefined) {
      const parsedEndTime = new Date(endTime)
      if (isNaN(parsedEndTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end time format' },
          { status: 400 }
        )
      }
      updateData.endTime = parsedEndTime
    }

    const stream = await db.stream.update({
      where: { id: params.id },
      data: updateData,
      include: {
        encodingSessions: true,
        adBreaks: true
      }
    })

    return NextResponse.json(stream)
  } catch (error) {
    console.error('Error updating stream:', error)
    return NextResponse.json(
      { error: 'Failed to update stream' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingStream = await db.stream.findUnique({
      where: { id: params.id }
    })

    if (!existingStream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      )
    }

    await db.stream.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Stream deleted successfully' })
  } catch (error) {
    console.error('Error deleting stream:', error)
    return NextResponse.json(
      { error: 'Failed to delete stream' },
      { status: 500 }
    )
  }
}