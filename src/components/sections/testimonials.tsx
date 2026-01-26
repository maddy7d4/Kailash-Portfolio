"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"

interface Feedback {
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

export function Testimonials() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const [testimonials, setTestimonials] = useState<Feedback[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        try {
            const response = await fetch('/api/feedback')
            const result = await response.json()
            if (result.success) {
                setTestimonials(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching feedback:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fallback testimonials if no feedback exists
    const fallbackTestimonials = [
        {
            text: "Kailas has an incredible eye for detail. The final edit exceeded our expectations.",
            author: "Sarah J., Director",
            stars: 5
        },
        {
            text: "Fast, professional, and creative. A true partner in the post-production process.",
            author: "Mike T., Producer",
            stars: 5
        },
        {
            text: "The sound design and pacing were spot on. Highly recommended!",
            author: "Alex R., Musician",
            stars: 5
        },
        {
            text: "Turned our raw footage into a cinematic masterpiece.",
            author: "Creative Agency XYZ",
            stars: 5
        }
    ]

    const displayTestimonials = testimonials.length > 0 
        ? testimonials.map(t => ({
            text: t.feedback,
            author: `${t.name}, ${t.designation}${t.brandName ? ` - ${t.brandName}` : ''}`,
            stars: t.stars
        }))
        : fallbackTestimonials

    if (isLoading) {
        return (
            <section className="py-32 relative overflow-hidden min-h-screen flex flex-col justify-center">
                <Container className="relative z-20">
                    <div className="text-center text-muted-foreground">Loading testimonials...</div>
                </Container>
            </section>
        )
    }

    return (
        <section className="py-32 relative overflow-hidden min-h-screen flex flex-col justify-center bg-background">
            {/* Parallax Video Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-background/90 dark:bg-background/80 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30 dark:opacity-50"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-people-working-in-office-4550/1080p.mp4" type="video/mp4" />
                </video>
            </motion.div>

            <Container className="relative z-20 mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-center">
                    <ShinyText>Client Love</ShinyText>
                </h2>
            </Container>

            {displayTestimonials.length > 0 ? (
                <div className="relative z-20 flex overflow-hidden">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="flex gap-8 whitespace-nowrap"
                    >
                        {[...displayTestimonials, ...displayTestimonials].map((t, i) => (
                            <div
                                key={i}
                                className="w-[400px] p-8 rounded-2xl bg-background/90 dark:bg-background/50 backdrop-blur-sm border border-border flex-shrink-0"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= t.stars
                                                    ? 'fill-primary text-primary'
                                                    : 'text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-lg mb-6 whitespace-normal text-foreground">"{t.text}"</p>
                                <p className="font-bold text-primary">{t.author}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                <Container className="relative z-20">
                    <div className="text-center text-muted-foreground">
                        No testimonials yet. Be the first to share your feedback!
                    </div>
                </Container>
            )}
        </section>
    )
}
