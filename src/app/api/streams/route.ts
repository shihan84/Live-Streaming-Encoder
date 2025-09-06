import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
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
    })

    return NextResponse.json(streams)
  } catch (error) {
    console.error('Error fetching streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      inputUrl,
      outputUrl,
      bitrate = 5000,
      resolution = '1920x1080',
      scte35Enabled = true,
      encoderPreset = 'high',
      gopSize = 12,
      bFrames = 5,
      profile = 'high',
      chroma = '4:2:0',
      aspectRatio = '16:9',
      keyframeInterval = 12,
      pcr = 'video_embedded',
      audioCodec = 'aac-lc',
      audioBitrate = 128,
      audioLKFS = -20,
      audioSampleRate = 48000,
      scte35Pid = 500,
      nullPid = 8191,
      latency = 2000,
      // Metadata fields
      description,
      genre,
      language = 'en',
      provider,
      network,
      channel,
      category,
      tags,
      customMetadata,
      epgId,
      contentRating,
      copyright,
      isLive = true,
      startTime,
      endTime
    } = body

    if (!name || !inputUrl || !outputUrl) {
      return NextResponse.json(
        { error: 'Name, input URL, and output URL are required' },
        { status: 400 }
      )
    }

    // Validate and parse tags
    let parsedTags = null
    if (tags) {
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      } else if (Array.isArray(tags)) {
        parsedTags = tags
      }
    }

    // Validate and parse custom metadata
    let parsedCustomMetadata = null
    if (customMetadata) {
      try {
        if (typeof customMetadata === 'string') {
          parsedCustomMetadata = JSON.parse(customMetadata)
        } else {
          parsedCustomMetadata = customMetadata
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid custom metadata JSON format' },
          { status: 400 }
        )
      }
    }

    // Parse date fields
    let parsedStartTime = null
    let parsedEndTime = null
    if (startTime) {
      parsedStartTime = new Date(startTime)
      if (isNaN(parsedStartTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start time format' },
          { status: 400 }
        )
      }
    }
    if (endTime) {
      parsedEndTime = new Date(endTime)
      if (isNaN(parsedEndTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end time format' },
          { status: 400 }
        )
      }
    }

    const stream = await db.stream.create({
      data: {
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
        // Metadata fields
        description,
        genre,
        language,
        provider,
        network,
        channel,
        category,
        tags: parsedTags,
        customMetadata: parsedCustomMetadata ? JSON.stringify(parsedCustomMetadata) : null,
        epgId,
        contentRating,
        copyright,
        isLive,
        startTime: parsedStartTime,
        endTime: parsedEndTime
      },
      include: {
        encodingSessions: true,
        adBreaks: true
      }
    })

    return NextResponse.json(stream, { status: 201 })
  } catch (error) {
    console.error('Error creating stream:', error)
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    )
  }
}