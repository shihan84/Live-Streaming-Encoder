import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
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
    })

    return NextResponse.json(adBreaks)
  } catch (error) {
    console.error('Error fetching ad breaks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad breaks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      streamId,
      name,
      scheduledTime,
      duration = 600,
      adId,
      description,
      providerName = 'YourProvider',
      providerId = '0x1',
      autoReturn = 600,
      cueType = 'CUE-OUT',
      preRollDuration = 0,
      crashOut = false,
      scte35Pid = 500
    } = body

    if (!streamId || !scheduledTime || !adId) {
      return NextResponse.json(
        { error: 'Stream ID, scheduled time, and ad ID are required' },
        { status: 400 }
      )
    }

    // Check if stream exists
    const stream = await db.stream.findUnique({
      where: { id: streamId }
    })

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      )
    }

    const adBreak = await db.adBreak.create({
      data: {
        streamId,
        name,
        scheduledTime: new Date(scheduledTime),
        duration,
        adId,
        description,
        providerName,
        providerId,
        autoReturn,
        cueType,
        preRollDuration,
        crashOut,
        scte35Pid
      },
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

    return NextResponse.json(adBreak, { status: 201 })
  } catch (error) {
    console.error('Error creating ad break:', error)
    return NextResponse.json(
      { error: 'Failed to create ad break' },
      { status: 500 }
    )
  }
}