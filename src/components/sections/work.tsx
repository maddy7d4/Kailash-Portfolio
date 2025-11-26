"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { BorderBeam } from "@/components/ui/border-beam"
import { ShinyText } from "@/components/ui/shiny-text"
import { BlurFade } from "@/components/ui/blur-fade"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SoundTrigger } from "@/components/ui/sound-trigger"

const projects = [
    {
        id: 1,
        title: "A Hyperlapse Exploration of Culture and Architecture",
        category: "Hyperlapse",
        description: "A journey through time and space, capturing the essence of cultural landmarks.",
        color: "bg-zinc-900 dark:bg-zinc-900 bg-zinc-100",
        image: "/hyperlapse_thumbnail.jpg",
        link: "https://www.instagram.com/reel/DJeJj9LP6-7/?igsh=Z2lpNGxzbXVyOWpt"
    },
    {
        id: 2,
        title: "A Hyperlapse Exploration of Culture and Architecture",
        category: "Hyperlapse",
        description: "A journey through time and space, capturing the essence of cultural landmarks.",
        color: "bg-zinc-800 dark:bg-zinc-800 bg-zinc-200",
        image: "/hyperlapse_thumbnail.jpg",
        link: "https://www.instagram.com/reel/DJeJj9LP6-7/?igsh=Z2lpNGxzbXVyOWpt"
    },
    {
        id: 3,
        title: "A Hyperlapse Exploration of Culture and Architecture",
        category: "Hyperlapse",
        description: "A journey through time and space, capturing the essence of cultural landmarks.",
        color: "bg-zinc-900 dark:bg-zinc-900 bg-zinc-100",
        image: "/hyperlapse_thumbnail.jpg",
        link: "https://www.instagram.com/reel/DJeJj9LP6-7/?igsh=Z2lpNGxzbXVyOWpt"
    },
    {
        id: 4,
        title: "A Hyperlapse Exploration of Culture and Architecture",
        category: "Hyperlapse",
        description: "A journey through time and space, capturing the essence of cultural landmarks.",
        color: "bg-zinc-800 dark:bg-zinc-800 bg-zinc-200",
        image: "/hyperlapse_thumbnail.jpg",
        link: "https://www.instagram.com/reel/DJeJj9LP6-7/?igsh=Z2lpNGxzbXVyOWpt"
    },
]

function Card({ project, index, range, targetScale }: any) {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(range, [0, 1], [1, targetScale])

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className={`relative flex flex-col w-[1000px] h-[500px] rounded-3xl p-12 origin-top ${project.color} border border-white/10 shadow-2xl overflow-hidden`}
            >
                <BorderBeam size={250} duration={12} delay={9} />

                <div className="flex flex-col h-full justify-between z-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-bold text-foreground">{project.title}</h3>
                        <span className="text-xl text-muted-foreground">{project.category}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <p className="text-lg text-foreground/80 max-w-md">{project.description}</p>
                        <Link href={project.link} target="_blank" className="flex items-center gap-2 text-foreground hover:underline">
                            View Project <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-60">
                    <motion.div style={{ scale: imageScale }} className="w-full h-full">
                        <BlurFade delay={0.2} inView>
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </BlurFade>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export function Work() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    return (
        <section ref={container} className="relative bg-background">
            <SoundTrigger profile="work" />
            <BackgroundBeams className="opacity-20" />
            <Container className="py-20">
                <div className="mb-20">
                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
                        <ShinyText>Selected Work</ShinyText>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        A collection of projects that define my style and approach to video editing.
                    </p>
                </div>

                <div className="flex flex-col gap-10">
                    {projects.map((project, i) => {
                        const targetScale = 1 - ((projects.length - i) * 0.05)
                        return (
                            <Card
                                key={i}
                                index={i}
                                project={project}
                                range={scrollYProgress}
                                targetScale={targetScale}
                            />
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
