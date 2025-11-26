"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"

const testimonials = [
    {
        text: "Kailas has an incredible eye for detail. The final edit exceeded our expectations.",
        author: "Sarah J., Director"
    },
    {
        text: "Fast, professional, and creative. A true partner in the post-production process.",
        author: "Mike T., Producer"
    },
    {
        text: "The sound design and pacing were spot on. Highly recommended!",
        author: "Alex R., Musician"
    },
    {
        text: "Turned our raw footage into a cinematic masterpiece.",
        author: "Creative Agency XYZ"
    }
]

export function Testimonials() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

    return (
        <section className="py-32 relative overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Parallax Video Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
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
            </motion.div>

            <Container className="relative z-20 mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-center">
                    <ShinyText>Client Love</ShinyText>
                </h2>
            </Container>

            <div className="relative z-20 flex overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-8 whitespace-nowrap"
                >
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="w-[400px] p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10 flex-shrink-0"
                        >
                            <p className="text-lg mb-6 whitespace-normal">"{t.text}"</p>
                            <p className="font-bold text-primary">{t.author}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
