"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { Particles } from "@/components/ui/particles"
import { Meteors } from "@/components/ui/meteors"
import { Star, Edit2, Trash2, Plus, X, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Feedback } from "@/lib/db"

export default function ManageFeedbackPage() {
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
        <section className="relative min-h-screen py-32 bg-background overflow-hidden">
            <Particles
                className="absolute inset-0 z-10"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />
            <Meteors number={20} />
            
            {/* Parallax Video Background */}
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
                                <ShinyText>Manage Feedback</ShinyText>
                            </h1>
                            <p className="text-muted-foreground">Add, edit, or delete feedback entries</p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors"
                            >
                                Back to Home
                            </Link>
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
                                            placeholder="Name"
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
                                            placeholder="Designation"
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
                                        placeholder="Brand Name"
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
                                        placeholder="Feedback text"
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
                                    <label className="block text-sm font-medium mb-2">
                                        Pros (Optional)
                                    </label>
                                    <textarea
                                        name="pros"
                                        value={formData.pros}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                        placeholder="Pros"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Cons (Optional)
                                    </label>
                                    <textarea
                                        name="cons"
                                        value={formData.cons}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                        placeholder="Cons"
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
                            <p className="text-muted-foreground mt-2">Click "Add Feedback" to create one.</p>
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
                                        <div className="flex justify-between items-start mb-4">
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
                                                <p className="text-foreground/90 mb-2">"{feedback.feedback}"</p>
                                                {feedback.pros && (
                                                    <p className="text-sm text-green-400 mb-1">
                                                        <span className="font-medium">Pros:</span> {feedback.pros}
                                                    </p>
                                                )}
                                                {feedback.cons && (
                                                    <p className="text-sm text-red-400 mb-1">
                                                        <span className="font-medium">Cons:</span> {feedback.cons}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <motion.button
                                                    onClick={() => startEdit(feedback)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors"
                                                    disabled={isDeleting === feedback.id}
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
            </Container>
        </section>
    )
}
