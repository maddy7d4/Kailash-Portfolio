import { NextRequest, NextResponse } from 'next/server'
import { getPlaylist, updatePlaylist, deletePlaylist } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const playlist = await getPlaylist(id)
    
    if (!playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: playlist })
  } catch (error) {
    console.error('Error fetching playlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlist' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, thumbnail } = body

    if (!title || !thumbnail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedPlaylist = await updatePlaylist(id, { title, thumbnail })
    if (!updatedPlaylist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedPlaylist })
  } catch (error) {
    console.error('Error updating playlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update playlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deletePlaylist(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Playlist deleted successfully' })
  } catch (error) {
    console.error('Error deleting playlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete playlist' },
      { status: 500 }
    )
  }
}
