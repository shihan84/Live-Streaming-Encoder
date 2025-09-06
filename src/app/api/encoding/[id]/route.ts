import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const encodingSession = await db.encodingSession.findUnique({
      where: { id: params.id },
      include: {
        stream: true
      }
    })

    if (!encodingSession) {
      return NextResponse.json(
        { error: 'Encoding session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(encodingSession)
  } catch (error) {
    console.error('Error fetching encoding session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch encoding session' },
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
      status,
      progress,
      inputBytes,
      outputBytes,
      pid,
      logPath,
      metadata
    } = body

    const existingSession = await db.encodingSession.findUnique({
      where: { id: params.id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Encoding session not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (progress !== undefined) updateData.progress = progress
    if (inputBytes !== undefined) updateData.inputBytes = inputBytes
    if (outputBytes !== undefined) updateData.outputBytes = outputBytes
    if (pid !== undefined) updateData.pid = pid
    if (logPath !== undefined) updateData.logPath = logPath

    // Handle completion
    if (status === 'COMPLETED' || status === 'ERROR') {
      updateData.endTime = new Date()
    }

    const encodingSession = await db.encodingSession.update({
      where: { id: params.id },
      data: updateData,
      include: {
        stream: true
      }
    })

    // Update stream status based on encoding session status
    if (status === 'COMPLETED' || status === 'ERROR' || status === 'STOPPING') {
      const newStreamStatus = status === 'COMPLETED' ? 'IDLE' : 
                             status === 'ERROR' ? 'ERROR' : 'STOPPING'
      
      await db.stream.update({
        where: { id: encodingSession.streamId },
        data: { status: newStreamStatus }
      })
    }

    // Log the encoding session update with metadata
    if (metadata) {
      await db.systemLog.create({
        data: {
          level: 'INFO',
          message: `Encoding session ${params.id} updated`,
          component: 'encoder',
          metadata: JSON.stringify(metadata)
        }
      })
    }

    return NextResponse.json(encodingSession)
  } catch (error) {
    console.error('Error updating encoding session:', error)
    return NextResponse.json(
      { error: 'Failed to update encoding session' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingSession = await db.encodingSession.findUnique({
      where: { id: params.id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Encoding session not found' },
        { status: 404 }
      )
    }

    // TODO: Stop the actual FFmpeg process if it's running
    // This would involve killing the process with the PID

    await db.encodingSession.delete({
      where: { id: params.id }
    })

    // Update stream status back to IDLE
    await db.stream.update({
      where: { id: existingSession.streamId },
      data: { status: 'IDLE' }
    })

    return NextResponse.json({ message: 'Encoding session deleted successfully' })
  } catch (error) {
    console.error('Error deleting encoding session:', error)
    return NextResponse.json(
      { error: 'Failed to delete encoding session' },
      { status: 500 }
    )
  }
}