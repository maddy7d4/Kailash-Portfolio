import { Redis } from '@upstash/redis'

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

// Initialize Redis client
// Supports both Vercel KV and Upstash Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const FEEDBACK_KEY = 'feedback:all'
const PLAYLISTS_KEY = 'playlists:all'

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

// Read feedback from database
export async function getFeedback(): Promise<Feedback[]> {
  try {
    const feedbacks = await redis.get<Feedback[]>(FEEDBACK_KEY)
    return feedbacks || []
  } catch (error) {
    console.error('Error reading feedback:', error)
    return []
  }
}

// Save feedback to database
export async function saveFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
  try {
    const feedbacks = await getFeedback()
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    feedbacks.push(newFeedback)
    await redis.set(FEEDBACK_KEY, feedbacks)
    return newFeedback
  } catch (error) {
    console.error('Error saving feedback:', error)
    throw error
  }
}

// Update feedback in database
export async function updateFeedback(id: string, feedback: Partial<Omit<Feedback, 'id' | 'createdAt'>>): Promise<Feedback | null> {
  try {
    const feedbacks = await getFeedback()
    const index = feedbacks.findIndex(f => f.id === id)
    if (index === -1) return null
    
    feedbacks[index] = {
      ...feedbacks[index],
      ...feedback,
    }
    await redis.set(FEEDBACK_KEY, feedbacks)
    return feedbacks[index]
  } catch (error) {
    console.error('Error updating feedback:', error)
    throw error
  }
}

// Delete feedback from database
export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    const feedbacks = await getFeedback()
    const filtered = feedbacks.filter(f => f.id !== id)
    if (filtered.length === feedbacks.length) return false // Not found
    await redis.set(FEEDBACK_KEY, filtered)
    return true
  } catch (error) {
    console.error('Error deleting feedback:', error)
    throw error
  }
}

// Playlist functions
export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const playlists = await redis.get<Playlist[]>(PLAYLISTS_KEY)
    return playlists || []
  } catch (error) {
    console.error('Error reading playlists:', error)
    return []
  }
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  try {
    const playlists = await getPlaylists()
    return playlists.find(p => p.id === id) || null
  } catch (error) {
    console.error('Error reading playlist:', error)
    return null
  }
}

export async function savePlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'videos'>): Promise<Playlist> {
  try {
    const playlists = await getPlaylists()
    const newPlaylist: Playlist = {
      ...playlist,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      videos: [],
      createdAt: new Date().toISOString(),
    }
    playlists.push(newPlaylist)
    await redis.set(PLAYLISTS_KEY, playlists)
    return newPlaylist
  } catch (error) {
    console.error('Error saving playlist:', error)
    throw error
  }
}

export async function updatePlaylist(id: string, playlist: Partial<Omit<Playlist, 'id' | 'createdAt' | 'videos'>>): Promise<Playlist | null> {
  try {
    const playlists = await getPlaylists()
    const index = playlists.findIndex(p => p.id === id)
    if (index === -1) return null
    
    playlists[index] = {
      ...playlists[index],
      ...playlist,
    }
    await redis.set(PLAYLISTS_KEY, playlists)
    return playlists[index]
  } catch (error) {
    console.error('Error updating playlist:', error)
    throw error
  }
}

export async function deletePlaylist(id: string): Promise<boolean> {
  try {
    const playlists = await getPlaylists()
    const filtered = playlists.filter(p => p.id !== id)
    if (filtered.length === playlists.length) return false
    await redis.set(PLAYLISTS_KEY, filtered)
    return true
  } catch (error) {
    console.error('Error deleting playlist:', error)
    throw error
  }
}

// Video functions
export async function addVideoToPlaylist(playlistId: string, video: Omit<Video, 'id' | 'createdAt'>): Promise<Video | null> {
  try {
    const playlists = await getPlaylists()
    const playlistIndex = playlists.findIndex(p => p.id === playlistId)
    if (playlistIndex === -1) return null
    
    const newVideo: Video = {
      ...video,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    playlists[playlistIndex].videos.push(newVideo)
    await redis.set(PLAYLISTS_KEY, playlists)
    return newVideo
  } catch (error) {
    console.error('Error adding video:', error)
    throw error
  }
}

export async function updateVideoInPlaylist(playlistId: string, videoId: string, video: Partial<Omit<Video, 'id' | 'createdAt'>>): Promise<Video | null> {
  try {
    const playlists = await getPlaylists()
    const playlistIndex = playlists.findIndex(p => p.id === playlistId)
    if (playlistIndex === -1) return null
    
    const videoIndex = playlists[playlistIndex].videos.findIndex(v => v.id === videoId)
    if (videoIndex === -1) return null
    
    playlists[playlistIndex].videos[videoIndex] = {
      ...playlists[playlistIndex].videos[videoIndex],
      ...video,
    }
    await redis.set(PLAYLISTS_KEY, playlists)
    return playlists[playlistIndex].videos[videoIndex]
  } catch (error) {
    console.error('Error updating video:', error)
    throw error
  }
}

export async function deleteVideoFromPlaylist(playlistId: string, videoId: string): Promise<boolean> {
  try {
    const playlists = await getPlaylists()
    const playlistIndex = playlists.findIndex(p => p.id === playlistId)
    if (playlistIndex === -1) return false
    
    const originalLength = playlists[playlistIndex].videos.length
    playlists[playlistIndex].videos = playlists[playlistIndex].videos.filter(v => v.id !== videoId)
    
    if (playlists[playlistIndex].videos.length === originalLength) return false
    
    await redis.set(PLAYLISTS_KEY, playlists)
    return true
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}
