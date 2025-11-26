"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ArrowDown } from "lucide-react"
import { TextReveal } from "@/components/ui/text-reveal"
import { Magnetic } from "@/components/ui/magnetic"
import { Particles } from "@/components/ui/particles"
import { TextScramble } from "@/components/ui/text-scramble"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { FlipWords } from "@/components/ui/flip-words"
import { SoundTrigger } from "@/components/ui/sound-trigger"
import { HeroScene } from "@/components/3d/hero-scene"

export function Hero() {

    return (
        <section className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
            <SoundTrigger profile="hero" />
            <HeroScene />
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-background/80 dark:bg-background/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-abstract-neon-lights-2679/1080p.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Particles Overlay */}
            <Particles
                className="absolute inset-0 z-10 animate-fade-in"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />

            <Container className="relative z-20 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-xl md:text-2xl font-medium tracking-widest text-accent uppercase mb-4 flex items-center justify-center gap-2"
                >
                    I am a <FlipWords words={["Video Editor", "Storyteller", "Filmmaker", "Creator"]} />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter text-foreground mb-6"
                >
                    <TextReveal>KAILAS</TextReveal>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
                        Crafting visual stories that captivate and inspire.
                    </p>

                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    >
                        <span>View Work</span>
                        <ArrowDown className="w-4 h-4" />
                    </HoverBorderGradient>
                </motion.div>
            </Container>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <Magnetic>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="cursor-pointer p-4"
                    >
                        <ArrowDown className="w-8 h-8 text-foreground/50" />
                    </motion.div>
                </Magnetic>
            </div>
        </section>
    )
}
