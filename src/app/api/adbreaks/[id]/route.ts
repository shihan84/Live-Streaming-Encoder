import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adBreak = await db.adBreak.findUnique({
      where: { id: params.id },
      include: {
        stream: true
      }
    })

    if (!adBreak) {
      return NextResponse.json(
        { error: 'Ad break not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(adBreak)
  } catch (error) {
    console.error('Error fetching ad break:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad break' },
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
      scheduledTime,
      duration,
      adId,
      description,
      status,
      providerName,
      providerId,
      autoReturn
    } = body

    const existingAdBreak = await db.adBreak.findUnique({
      where: { id: params.id }
    })

    if (!existingAdBreak) {
      return NextResponse.json(
        { error: 'Ad break not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (scheduledTime !== undefined) updateData.scheduledTime = new Date(scheduledTime)
    if (duration !== undefined) updateData.duration = duration
    if (adId !== undefined) updateData.adId = adId
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (providerName !== undefined) updateData.providerName = providerName
    if (providerId !== undefined) updateData.providerId = providerId
    if (autoReturn !== undefined) updateData.autoReturn = autoReturn

    const adBreak = await db.adBreak.update({
      where: { id: params.id },
      data: updateData,
      include: {
        stream: true
      }
    })

    return NextResponse.json(adBreak)
  } catch (error) {
    console.error('Error updating ad break:', error)
    return NextResponse.json(
      { error: 'Failed to update ad break' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAdBreak = await db.adBreak.findUnique({
      where: { id: params.id }
    })

    if (!existingAdBreak) {
      return NextResponse.json(
        { error: 'Ad break not found' },
        { status: 404 }
      )
    }

    await db.adBreak.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Ad break deleted successfully' })
  } catch (error) {
    console.error('Error deleting ad break:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad break' },
      { status: 500 }
    )
  }
}