import { NextRequest, NextResponse } from 'next/server'
import { getPlaylists, savePlaylist } from '@/lib/db'

export async function GET() {
  try {
    const playlists = await getPlaylists()
    return NextResponse.json({ success: true, data: playlists })
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, thumbnail } = body

    if (!title || !thumbnail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newPlaylist = await savePlaylist({ title, thumbnail })
    return NextResponse.json({ success: true, data: newPlaylist }, { status: 201 })
  } catch (error) {
    console.error('Error saving playlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save playlist' },
      { status: 500 }
    )
  }
}
