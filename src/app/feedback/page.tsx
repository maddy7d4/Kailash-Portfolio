"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { Particles } from "@/components/ui/particles"
import { Meteors } from "@/components/ui/meteors"
import { Star, Send, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FeedbackPage() {
    const router = useRouter()
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleStarClick = (rating: number) => {
        setFormData(prev => ({ ...prev, stars: rating }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            } else {
                alert(result.error || 'Failed to submit feedback')
            }
        } catch (error) {
            console.error('Error submitting feedback:', error)
            alert('Failed to submit feedback. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
                <Particles
                    className="absolute inset-0 z-10"
                    quantity={100}
                    ease={80}
                    color="#ffffff"
                    refresh
                />
                <Meteors number={20} />
                <Container className="relative z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            <ShinyText>Thank You!</ShinyText>
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Your feedback has been submitted successfully.
                        </p>
                    </motion.div>
                </Container>
            </section>
        )
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
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                        <ShinyText>Share Your Feedback</ShinyText>
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 text-lg">
                        Help us improve by sharing your experience
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="designation" className="block text-sm font-medium mb-2">
                                    Designation <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    required
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Your designation"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="brandName" className="block text-sm font-medium mb-2">
                                Brand Name <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                id="brandName"
                                name="brandName"
                                required
                                value={formData.brandName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                placeholder="Your brand or company name"
                            />
                        </div>

                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                                Feedback <span className="text-primary">*</span>
                            </label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                required
                                rows={5}
                                value={formData.feedback}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                placeholder="Share your thoughts..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-4">
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
                                            className={`w-8 h-8 ${
                                                star <= (hoveredStar || formData.stars)
                                                    ? 'fill-primary text-primary'
                                                    : 'text-muted-foreground'
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {formData.stars > 0 && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {formData.stars} out of 5 stars
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="pros" className="block text-sm font-medium mb-2">
                                Pros (Optional)
                            </label>
                            <textarea
                                id="pros"
                                name="pros"
                                rows={3}
                                value={formData.pros}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                placeholder="What did you like?"
                            />
                        </div>

                        <div>
                            <label htmlFor="cons" className="block text-sm font-medium mb-2">
                                Cons (Optional)
                            </label>
                            <textarea
                                id="cons"
                                name="cons"
                                rows={3}
                                value={formData.cons}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
                                placeholder="What could be improved?"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting || formData.stars === 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-primary/90"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </Container>
        </section>
    )
}
