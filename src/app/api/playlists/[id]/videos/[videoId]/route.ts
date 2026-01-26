import { NextRequest, NextResponse } from 'next/server'
import { updateVideoInPlaylist, deleteVideoFromPlaylist } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  try {
    const { id, videoId } = await params
    const body = await request.json()
    const { title, link, thumbnail, description } = body

    if (!title || !link || !thumbnail || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedVideo = await updateVideoInPlaylist(id, videoId, { title, link, thumbnail, description })
    if (!updatedVideo) {
      return NextResponse.json(
        { success: false, error: 'Video or playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedVideo })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  try {
    const { id, videoId } = await params
    const deleted = await deleteVideoFromPlaylist(id, videoId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Video or playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
