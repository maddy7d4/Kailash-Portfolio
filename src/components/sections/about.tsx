"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"
import { TiltCard } from "@/components/ui/tilt-card"
import { BlurFade } from "@/components/ui/blur-fade"
import { LazyImage } from "@/components/ui/lazy-image"
import { ShinyText } from "@/components/ui/shiny-text"
import { SoundTrigger } from "@/components/ui/sound-trigger"
import { useRef } from "react"

export function About() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"]
    })
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

    return (
        <section id="about" ref={container} className="py-16 sm:py-24 md:py-32 bg-background relative overflow-hidden">
            <SoundTrigger profile="about" />
            <Container>
                <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
                    <div className="w-full md:w-1/2">
                        <TiltCard className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-primary/20 to-accent/20">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <LazyImage
                                    src="/kailas_profile.JPG"
                                    alt="Kailas"
                                    className="object-cover object-top"
                                />
                            </div>
                        </TiltCard>
                    </div>

                    <div className="w-full md:w-1/2">
                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5 sm:mb-8"
                        >
                            <ShinyText>About Me</ShinyText>
                        </motion.h2>

                        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-foreground">
                            <p>
                                I'm a passionate video editor with over 5 years of experience in crafting compelling visual narratives. My journey began with a love for cinema and has evolved into a career helping brands and creators tell their stories.
                            </p>
                            <p>
                                I specialize in rhythm-based editing, color grading, and sound design. My goal is to not just edit footage, but to evoke emotion and keep the audience engaged from the first frame to the last.
                            </p>
                            <p>
                                When I'm not editing, you can find me exploring new camera gear, watching classic films, or traveling for inspiration.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section >
    )
}
