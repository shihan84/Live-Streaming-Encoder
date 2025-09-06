import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const encodingSessions = await db.encodingSession.findMany({
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
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(encodingSessions)
  } catch (error) {
    console.error('Error fetching encoding sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch encoding sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { streamId } = body

    if (!streamId) {
      return NextResponse.json(
        { error: 'Stream ID is required' },
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

    // Check if there's already an active encoding session for this stream
    const activeSession = await db.encodingSession.findFirst({
      where: {
        streamId,
        status: {
          in: ['STARTING', 'RUNNING']
        }
      }
    })

    if (activeSession) {
      return NextResponse.json(
        { error: 'Stream is already being encoded' },
        { status: 400 }
      )
    }

    // Create encoding session
    const encodingSession = await db.encodingSession.create({
      data: {
        streamId,
        status: 'STARTING'
      },
      include: {
        stream: true
      }
    })

    // Update stream status
    await db.stream.update({
      where: { id: streamId },
      data: { status: 'ENCODING' }
    })

    // TODO: Start actual FFmpeg process here
    // This would involve spawning a child process with FFmpeg
    // and updating the session with the PID and other details

    return NextResponse.json(encodingSession, { status: 201 })
  } catch (error) {
    console.error('Error creating encoding session:', error)
    return NextResponse.json(
      { error: 'Failed to create encoding session' },
      { status: 500 }
    )
  }
}