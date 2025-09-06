import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const component = searchParams.get('component')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {}
    if (level) whereClause.level = level
    if (component) whereClause.component = component

    const logs = await db.systemLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await db.systemLog.count({ where: whereClause })

    return NextResponse.json({
      logs,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching system logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      level = 'INFO',
      message,
      component,
      metadata
    } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const log = await db.systemLog.create({
      data: {
        level,
        message,
        component,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating system log:', error)
    return NextResponse.json(
      { error: 'Failed to create system log' },
      { status: 500 }
    )
  }
}