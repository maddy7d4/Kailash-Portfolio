import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NEON_DB!)

let dbReady = false

async function ensureDb() {
  if (dbReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      feedback TEXT NOT NULL,
      stars INTEGER NOT NULL,
      pros TEXT,
      cons TEXT,
      created_at TEXT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS playlists (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      playlist_id TEXT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      link TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
  dbReady = true
}

export interface Feedback {
  id: string
  name: string
  designation: string
  brandName: string
  feedback: string
  stars: number
  pros?: string
  cons?: string
  createdAt: string
}

export interface Video {
  id: string
  title: string
  link: string
  thumbnail: string
  description: string
  createdAt: string
}

export interface Playlist {
  id: string
  title: string
  thumbnail: string
  videos: Video[]
  createdAt: string
}

function rowToFeedback(row: Record<string, unknown>): Feedback {
  return {
    id: row.id as string,
    name: row.name as string,
    designation: row.designation as string,
    brandName: row.brand_name as string,
    feedback: row.feedback as string,
    stars: row.stars as number,
    pros: row.pros as string | undefined,
    cons: row.cons as string | undefined,
    createdAt: row.created_at as string,
  }
}

export async function getFeedback(): Promise<Feedback[]> {
  try {
    await ensureDb()
    const rows = await sql`SELECT * FROM feedback ORDER BY created_at DESC`
    return rows.map(rowToFeedback)
  } catch (error) {
    console.error('Error reading feedback:', error)
    return []
  }
}

export async function saveFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
  await ensureDb()
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
  const createdAt = new Date().toISOString()
  await sql`
    INSERT INTO feedback (id, name, designation, brand_name, feedback, stars, pros, cons, created_at)
    VALUES (${id}, ${feedback.name}, ${feedback.designation}, ${feedback.brandName},
            ${feedback.feedback}, ${feedback.stars}, ${feedback.pros ?? null},
            ${feedback.cons ?? null}, ${createdAt})
  `
  return { ...feedback, id, createdAt }
}

export async function updateFeedback(id: string, feedback: Partial<Omit<Feedback, 'id' | 'createdAt'>>): Promise<Feedback | null> {
  await ensureDb()
  const rows = await sql`SELECT * FROM feedback WHERE id = ${id}`
  if (rows.length === 0) return null
  const current = rowToFeedback(rows[0] as Record<string, unknown>)
  const updated = { ...current, ...feedback }
  await sql`
    UPDATE feedback
    SET name = ${updated.name}, designation = ${updated.designation},
        brand_name = ${updated.brandName}, feedback = ${updated.feedback},
        stars = ${updated.stars}, pros = ${updated.pros ?? null}, cons = ${updated.cons ?? null}
    WHERE id = ${id}
  `
  return updated
}

export async function deleteFeedback(id: string): Promise<boolean> {
  await ensureDb()
  const result = await sql`DELETE FROM feedback WHERE id = ${id} RETURNING id`
  return result.length > 0
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    await ensureDb()
    const rows = await sql`
      SELECT p.id, p.title, p.thumbnail, p.created_at,
             v.id AS vid_id, v.title AS vid_title, v.link, v.thumbnail AS vid_thumbnail,
             v.description, v.created_at AS vid_created_at
      FROM playlists p
      LEFT JOIN videos v ON v.playlist_id = p.id
      ORDER BY p.created_at DESC, v.created_at ASC
    `
    const map = new Map<string, Playlist>()
    for (const row of rows) {
      if (!map.has(row.id as string)) {
        map.set(row.id as string, {
          id: row.id as string,
          title: row.title as string,
          thumbnail: row.thumbnail as string,
          createdAt: row.created_at as string,
          videos: [],
        })
      }
      if (row.vid_id) {
        map.get(row.id as string)!.videos.push({
          id: row.vid_id as string,
          title: row.vid_title as string,
          link: row.link as string,
          thumbnail: row.vid_thumbnail as string,
          description: row.description as string,
          createdAt: row.vid_created_at as string,
        })
      }
    }
    return Array.from(map.values())
  } catch (error) {
    console.error('Error reading playlists:', error)
    return []
  }
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  try {
    await ensureDb()
    const rows = await sql`
      SELECT p.id, p.title, p.thumbnail, p.created_at,
             v.id AS vid_id, v.title AS vid_title, v.link, v.thumbnail AS vid_thumbnail,
             v.description, v.created_at AS vid_created_at
      FROM playlists p
      LEFT JOIN videos v ON v.playlist_id = p.id
      WHERE p.id = ${id}
      ORDER BY v.created_at ASC
    `
    if (rows.length === 0) return null
    const first = rows[0]
    const playlist: Playlist = {
      id: first.id as string,
      title: first.title as string,
      thumbnail: first.thumbnail as string,
      createdAt: first.created_at as string,
      videos: [],
    }
    for (const row of rows) {
      if (row.vid_id) {
        playlist.videos.push({
          id: row.vid_id as string,
          title: row.vid_title as string,
          link: row.link as string,
          thumbnail: row.vid_thumbnail as string,
          description: row.description as string,
          createdAt: row.vid_created_at as string,
        })
      }
    }
    return playlist
  } catch (error) {
    console.error('Error reading playlist:', error)
    return null
  }
}

export async function savePlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'videos'>): Promise<Playlist> {
  await ensureDb()
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
  const createdAt = new Date().toISOString()
  await sql`
    INSERT INTO playlists (id, title, thumbnail, created_at)
    VALUES (${id}, ${playlist.title}, ${playlist.thumbnail}, ${createdAt})
  `
  return { ...playlist, id, createdAt, videos: [] }
}

export async function updatePlaylist(id: string, playlist: Partial<Omit<Playlist, 'id' | 'createdAt' | 'videos'>>): Promise<Playlist | null> {
  await ensureDb()
  const current = await getPlaylist(id)
  if (!current) return null
  const updated = { ...current, ...playlist }
  await sql`
    UPDATE playlists SET title = ${updated.title}, thumbnail = ${updated.thumbnail}
    WHERE id = ${id}
  `
  return updated
}

export async function deletePlaylist(id: string): Promise<boolean> {
  await ensureDb()
  const result = await sql`DELETE FROM playlists WHERE id = ${id} RETURNING id`
  return result.length > 0
}

export async function addVideoToPlaylist(playlistId: string, video: Omit<Video, 'id' | 'createdAt'>): Promise<Video | null> {
  await ensureDb()
  const playlists = await sql`SELECT id FROM playlists WHERE id = ${playlistId}`
  if (playlists.length === 0) return null
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
  const createdAt = new Date().toISOString()
  await sql`
    INSERT INTO videos (id, playlist_id, title, link, thumbnail, description, created_at)
    VALUES (${id}, ${playlistId}, ${video.title}, ${video.link}, ${video.thumbnail},
            ${video.description}, ${createdAt})
  `
  return { ...video, id, createdAt }
}

export async function updateVideoInPlaylist(playlistId: string, videoId: string, video: Partial<Omit<Video, 'id' | 'createdAt'>>): Promise<Video | null> {
  await ensureDb()
  const rows = await sql`SELECT * FROM videos WHERE id = ${videoId} AND playlist_id = ${playlistId}`
  if (rows.length === 0) return null
  const current = rows[0]
  const updated = {
    title: (video.title ?? current.title) as string,
    link: (video.link ?? current.link) as string,
    thumbnail: (video.thumbnail ?? current.thumbnail) as string,
    description: (video.description ?? current.description) as string,
  }
  await sql`
    UPDATE videos SET title = ${updated.title}, link = ${updated.link},
        thumbnail = ${updated.thumbnail}, description = ${updated.description}
    WHERE id = ${videoId}
  `
  return { id: videoId, createdAt: current.created_at as string, ...updated }
}

export async function deleteVideoFromPlaylist(playlistId: string, videoId: string): Promise<boolean> {
  await ensureDb()
  const result = await sql`
    DELETE FROM videos WHERE id = ${videoId} AND playlist_id = ${playlistId} RETURNING id
  `
  return result.length > 0
}
