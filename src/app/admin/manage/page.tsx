"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { Particles } from "@/components/ui/particles"
import { Meteors } from "@/components/ui/meteors"
import { Star, Edit2, Trash2, Plus, X, Save, Loader2, MessageSquare, Play, Video } from "lucide-react"
import Link from "next/link"
import type { Feedback, Playlist, Video as VideoType } from "@/lib/db"

type Tab = 'feedback' | 'playlists'

export default function AdminManagePage() {
    const [activeTab, setActiveTab] = useState<Tab>('feedback')
    
    return (
        <section className="relative min-h-screen py-32 bg-background overflow-hidden">
            <Particles
                className="absolute inset-0 z-10"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />
            <Meteors number={20} />
            
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background/80 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-people-working-in-office-4550/1080p.mp4" type="video/mp4" />
                </video>
            </div>

            <Container className="relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-2">
                                <ShinyText>Admin Panel</ShinyText>
                            </h1>
                            <p className="text-muted-foreground">Manage feedback and playlists</p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'feedback'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Feedback
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('playlists')}
                            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'playlists'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                Playlists
                            </div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'feedback' && (
                            <FeedbackManagement key="feedback" />
                        )}
                        {activeTab === 'playlists' && (
                            <PlaylistManagement key="playlists" />
                        )}
                    </AnimatePresence>
                </motion.div>
            </Container>
        </section>
    )
}

// Feedback Management Component
function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        brandName: "",
        feedback: "",
        stars: 0,
        pros: "",
        cons: "",
    })
    const [hoveredStar, setHoveredStar] = useState(0)

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch('/api/feedback')
            const result = await response.json()
            if (result.success) {
                setFeedbacks(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching feedback:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleStarClick = (rating: number) => {
        setFormData(prev => ({ ...prev, stars: rating }))
    }

    const startEdit = (feedback: Feedback) => {
        setFormData({
            name: feedback.name,
            designation: feedback.designation,
            brandName: feedback.brandName,
            feedback: feedback.feedback,
            stars: feedback.stars,
            pros: feedback.pros || "",
            cons: feedback.cons || "",
        })
        setEditingId(feedback.id)
        setIsAdding(false)
    }

    const startAdd = () => {
        setFormData({
            name: "",
            designation: "",
            brandName: "",
            feedback: "",
            stars: 0,
            pros: "",
            cons: "",
        })
        setEditingId(null)
        setIsAdding(true)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setIsAdding(false)
        setFormData({
            name: "",
            designation: "",
            brandName: "",
            feedback: "",
            stars: 0,
            pros: "",
            cons: "",
        })
    }

    const handleSave = async () => {
        if (!formData.name || !formData.designation || !formData.brandName || !formData.feedback || formData.stars === 0) {
            alert('Please fill in all required fields')
            return
        }

        try {
            if (isAdding) {
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchFeedbacks()
                    cancelEdit()
                } else {
                    alert(result.error || 'Failed to add feedback')
                }
            } else if (editingId) {
                const response = await fetch(`/api/feedback/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchFeedbacks()
                    cancelEdit()
                } else {
                    alert(result.error || 'Failed to update feedback')
                }
            }
        } catch (error) {
            console.error('Error saving feedback:', error)
            alert('Failed to save feedback')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return

        setIsDeleting(id)
        try {
            const response = await fetch(`/api/feedback/${id}`, {
                method: 'DELETE',
            })
            const result = await response.json()
            if (result.success) {
                await fetchFeedbacks()
            } else {
                alert(result.error || 'Failed to delete feedback')
            }
        } catch (error) {
            console.error('Error deleting feedback:', error)
            alert('Failed to delete feedback')
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-end mb-6">
                {!isAdding && !editingId && (
                    <motion.button
                        onClick={startAdd}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Feedback
                    </motion.button>
                )}
            </div>

            {(isAdding || editingId) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {isAdding ? 'Add New Feedback' : 'Edit Feedback'}
                        </h2>
                        <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Designation <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Brand Name <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Feedback <span className="text-primary">*</span>
                            </label>
                            <textarea
                                name="feedback"
                                value={formData.feedback}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rating <span className="text-primary">*</span>
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${
                                                star <= (hoveredStar || formData.stars)
                                                    ? 'fill-primary text-primary'
                                                    : 'text-muted-foreground'
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Pros (Optional)</label>
                            <textarea
                                name="pros"
                                value={formData.pros}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Cons (Optional)</label>
                            <textarea
                                name="cons"
                                value={formData.cons}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <motion.button
                                onClick={handleSave}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </motion.button>
                            <button
                                onClick={cancelEdit}
                                className="px-6 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {isLoading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading feedback...</p>
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10">
                    <p className="text-muted-foreground text-lg">No feedback entries yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {feedbacks.map((feedback) => (
                            <motion.div
                                key={feedback.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold">{feedback.name}</h3>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-muted-foreground">{feedback.designation}</span>
                                            {feedback.brandName && (
                                                <>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span className="text-primary font-medium">{feedback.brandName}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= feedback.stars
                                                            ? 'fill-primary text-primary'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-foreground/90">"{feedback.feedback}"</p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <motion.button
                                            onClick={() => startEdit(feedback)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(feedback.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-lg bg-secondary hover:bg-red-500 hover:text-white transition-colors"
                                            disabled={isDeleting === feedback.id}
                                        >
                                            {isDeleting === feedback.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}

// Playlist Management Component (YouTube-like layout)
function PlaylistManagement() {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)
    const [isAddingPlaylist, setIsAddingPlaylist] = useState(false)
    const [isDeletingPlaylist, setIsDeletingPlaylist] = useState<string | null>(null)
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
    const [isAddingVideo, setIsAddingVideo] = useState(false)
    const [isDeletingVideo, setIsDeletingVideo] = useState<string | null>(null)
    
    const [playlistFormData, setPlaylistFormData] = useState({
        title: "",
        thumbnail: "",
    })
    
    const [videoFormData, setVideoFormData] = useState({
        title: "",
        link: "",
        thumbnail: "",
        description: "",
    })

    useEffect(() => {
        fetchPlaylists()
    }, [])

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('/api/playlists')
            const result = await response.json()
            if (result.success) {
                setPlaylists(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching playlists:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePlaylistInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPlaylistFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setVideoFormData(prev => ({ ...prev, [name]: value }))
    }

    const startAddPlaylist = () => {
        setPlaylistFormData({ title: "", thumbnail: "" })
        setEditingPlaylistId(null)
        setIsAddingPlaylist(true)
        setSelectedPlaylistId(null)
    }

    const startEditPlaylist = (playlist: Playlist) => {
        setPlaylistFormData({ title: playlist.title, thumbnail: playlist.thumbnail })
        setEditingPlaylistId(playlist.id)
        setIsAddingPlaylist(false)
    }

    const cancelPlaylistEdit = () => {
        setEditingPlaylistId(null)
        setIsAddingPlaylist(false)
        setPlaylistFormData({ title: "", thumbnail: "" })
    }

    const handleSavePlaylist = async () => {
        if (!playlistFormData.title || !playlistFormData.thumbnail) {
            alert('Please fill in all required fields')
            return
        }

        try {
            if (isAddingPlaylist) {
                const response = await fetch('/api/playlists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(playlistFormData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchPlaylists()
                    cancelPlaylistEdit()
                } else {
                    alert(result.error || 'Failed to add playlist')
                }
            } else if (editingPlaylistId) {
                const response = await fetch(`/api/playlists/${editingPlaylistId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(playlistFormData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchPlaylists()
                    cancelPlaylistEdit()
                } else {
                    alert(result.error || 'Failed to update playlist')
                }
            }
        } catch (error) {
            console.error('Error saving playlist:', error)
            alert('Failed to save playlist')
        }
    }

    const handleDeletePlaylist = async (id: string) => {
        if (!confirm('Are you sure you want to delete this playlist?')) return

        setIsDeletingPlaylist(id)
        try {
            const response = await fetch(`/api/playlists/${id}`, {
                method: 'DELETE',
            })
            const result = await response.json()
            if (result.success) {
                await fetchPlaylists()
                if (selectedPlaylistId === id) {
                    setSelectedPlaylistId(null)
                }
            } else {
                alert(result.error || 'Failed to delete playlist')
            }
        } catch (error) {
            console.error('Error deleting playlist:', error)
            alert('Failed to delete playlist')
        } finally {
            setIsDeletingPlaylist(null)
        }
    }

    const startAddVideo = (playlistId: string) => {
        setVideoFormData({ title: "", link: "", thumbnail: "", description: "" })
        setEditingVideoId(null)
        setIsAddingVideo(true)
        setSelectedPlaylistId(playlistId)
    }

    const startEditVideo = (playlistId: string, video: VideoType) => {
        setVideoFormData({
            title: video.title,
            link: video.link,
            thumbnail: video.thumbnail,
            description: video.description,
        })
        setEditingVideoId(video.id)
        setIsAddingVideo(false)
        setSelectedPlaylistId(playlistId)
    }

    const cancelVideoEdit = () => {
        setEditingVideoId(null)
        setIsAddingVideo(false)
        setVideoFormData({ title: "", link: "", thumbnail: "", description: "" })
    }

    const handleSaveVideo = async () => {
        if (!videoFormData.title || !videoFormData.link || !videoFormData.thumbnail || !videoFormData.description) {
            alert('Please fill in all required fields')
            return
        }

        if (!selectedPlaylistId) return

        try {
            if (isAddingVideo) {
                const response = await fetch(`/api/playlists/${selectedPlaylistId}/videos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(videoFormData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchPlaylists()
                    cancelVideoEdit()
                } else {
                    alert(result.error || 'Failed to add video')
                }
            } else if (editingVideoId) {
                const response = await fetch(`/api/playlists/${selectedPlaylistId}/videos/${editingVideoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(videoFormData),
                })
                const result = await response.json()
                if (result.success) {
                    await fetchPlaylists()
                    cancelVideoEdit()
                } else {
                    alert(result.error || 'Failed to update video')
                }
            }
        } catch (error) {
            console.error('Error saving video:', error)
            alert('Failed to save video')
        }
    }

    const handleDeleteVideo = async (playlistId: string, videoId: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return

        setIsDeletingVideo(videoId)
        try {
            const response = await fetch(`/api/playlists/${playlistId}/videos/${videoId}`, {
                method: 'DELETE',
            })
            const result = await response.json()
            if (result.success) {
                await fetchPlaylists()
            } else {
                alert(result.error || 'Failed to delete video')
            }
        } catch (error) {
            console.error('Error deleting video:', error)
            alert('Failed to delete video')
        } finally {
            setIsDeletingVideo(null)
        }
    }

    const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId)

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
            {/* Playlists Sidebar (YouTube-like) */}
            <div className="lg:col-span-1 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Playlists</h2>
                    {!isAddingPlaylist && !editingPlaylistId && (
                        <motion.button
                            onClick={startAddPlaylist}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>

                {(isAddingPlaylist || editingPlaylistId) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10 mb-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">{isAddingPlaylist ? 'Add Playlist' : 'Edit Playlist'}</h3>
                            <button onClick={cancelPlaylistEdit} className="p-1 rounded hover:bg-secondary">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="title"
                                value={playlistFormData.title}
                                onChange={handlePlaylistInputChange}
                                placeholder="Playlist Title"
                                className="w-full px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors text-sm"
                            />
                            <input
                                type="text"
                                name="thumbnail"
                                value={playlistFormData.thumbnail}
                                onChange={handlePlaylistInputChange}
                                placeholder="Thumbnail URL"
                                className="w-full px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors text-sm"
                            />
                            <div className="flex gap-2">
                                <motion.button
                                    onClick={handleSavePlaylist}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90"
                                >
                                    Save
                                </motion.button>
                                <button
                                    onClick={cancelPlaylistEdit}
                                    className="px-3 py-2 rounded-lg bg-secondary text-sm hover:bg-secondary/80"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {isLoading ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10">
                        <p className="text-muted-foreground text-sm">No playlists yet.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {playlists.map((playlist) => (
                            <motion.div
                                key={playlist.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedPlaylistId(playlist.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${
                                    selectedPlaylistId === playlist.id
                                        ? 'bg-primary/20 border border-primary'
                                        : 'bg-background/50 backdrop-blur-sm border border-white/10 hover:bg-background/70'
                                }`}
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={playlist.thumbnail}
                                        alt={playlist.title}
                                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{playlist.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                startEditPlaylist(playlist)
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 rounded hover:bg-secondary"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </motion.button>
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeletePlaylist(playlist.id)
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 rounded hover:bg-red-500/20"
                                            disabled={isDeletingPlaylist === playlist.id}
                                        >
                                            {isDeletingPlaylist === playlist.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3 h-3" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Videos Content Area (YouTube-like) */}
            <div className="lg:col-span-2">
                {selectedPlaylist ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedPlaylist.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {selectedPlaylist.videos.length} video{selectedPlaylist.videos.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            {!isAddingVideo && !editingVideoId && (
                                <motion.button
                                    onClick={() => startAddVideo(selectedPlaylist.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Video
                                </motion.button>
                            )}
                        </div>

                        {(isAddingVideo || editingVideoId) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">
                                        {isAddingVideo ? 'Add Video' : 'Edit Video'}
                                    </h3>
                                    <button onClick={cancelVideoEdit} className="p-2 rounded-lg hover:bg-secondary">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={videoFormData.title}
                                            onChange={handleVideoInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Link *</label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={videoFormData.link}
                                            onChange={handleVideoInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Thumbnail *</label>
                                        <input
                                            type="text"
                                            name="thumbnail"
                                            value={videoFormData.thumbnail}
                                            onChange={handleVideoInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Description *</label>
                                        <textarea
                                            name="description"
                                            value={videoFormData.description}
                                            onChange={handleVideoInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <motion.button
                                            onClick={handleSaveVideo}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </motion.button>
                                        <button
                                            onClick={cancelVideoEdit}
                                            className="px-6 py-2 rounded-lg bg-secondary hover:bg-secondary/80"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {selectedPlaylist.videos.length === 0 ? (
                            <div className="text-center py-12 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10">
                                <p className="text-muted-foreground">No videos in this playlist yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {selectedPlaylist.videos.map((video) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm border border-white/10"
                                        >
                                            <div className="relative aspect-video">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <motion.button
                                                        onClick={() => startEditVideo(selectedPlaylist.id, video)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-1.5 rounded bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteVideo(selectedPlaylist.id, video.id)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-1.5 rounded bg-background/80 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-colors"
                                                        disabled={isDeletingVideo === video.id}
                                                    >
                                                        {isDeletingVideo === video.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3 h-3" />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10">
                        <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Select a playlist to manage videos</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
