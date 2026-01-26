import { NextRequest, NextResponse } from 'next/server'
import { addVideoToPlaylist } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, link, thumbnail, description } = body

    if (!title || !link || !thumbnail || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newVideo = await addVideoToPlaylist(id, { title, link, thumbnail, description })
    if (!newVideo) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: newVideo }, { status: 201 })
  } catch (error) {
    console.error('Error adding video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add video' },
      { status: 500 }
    )
  }
}
