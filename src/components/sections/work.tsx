"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { BorderBeam } from "@/components/ui/border-beam"
import { ShinyText } from "@/components/ui/shiny-text"
import { BlurFade } from "@/components/ui/blur-fade"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SoundTrigger } from "@/components/ui/sound-trigger"
import type { Playlist } from "@/lib/db"

function Card({ playlist, index, range, targetScale }: { playlist: Playlist; index: number; range: any; targetScale: number }) {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(range, [0, 1], [1, targetScale])
    
    const colors = [
        "bg-zinc-900 dark:bg-zinc-900 bg-zinc-100",
        "bg-zinc-800 dark:bg-zinc-800 bg-zinc-200",
    ]
    const color = colors[index % colors.length]

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 sm:px-6">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className={`relative flex flex-col w-full max-w-[1000px] h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 origin-top ${color} border border-white/10 shadow-2xl overflow-hidden`}
            >
                <BorderBeam size={250} duration={12} delay={9} />

                <div className="flex flex-col h-full justify-between z-10">
                    <div className="flex justify-between items-start gap-3">
                        <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                            {playlist.title}
                        </h3>
                        <span className="shrink-0 text-sm sm:text-lg md:text-xl text-muted-foreground mt-1">
                            {playlist.videos.length} Videos
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-between items-end gap-3">
                        <p className="text-sm sm:text-base md:text-lg text-foreground/80 max-w-md">
                            A curated collection of {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
                        </p>
                        <Link href={`/playlist/${playlist.id}`} className="shrink-0 flex items-center gap-1.5 text-sm sm:text-base text-foreground hover:underline">
                            View Playlist <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl opacity-60">
                    <motion.div style={{ scale: imageScale }} className="w-full h-full">
                        <BlurFade delay={0.2} inView>
                            <img
                                src={playlist.thumbnail}
                                alt={playlist.title}
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
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState(true)

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

    return (
        <section ref={container} className="relative bg-background">
            <SoundTrigger profile="work" />
            <BackgroundBeams className="opacity-20" />
            <Container className="py-20">
                <div className="mb-12 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
                        <ShinyText>Selected Work</ShinyText>
                    </h2>
                    <p className="text-base sm:text-xl text-muted-foreground max-w-2xl">
                        A collection of playlists that define my style and approach to video editing.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Loading playlists...</p>
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No playlists available yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {playlists.map((playlist, i) => {
                            const targetScale = 1 - ((playlists.length - i) * 0.05)
                            return (
                                <Card
                                    key={playlist.id}
                                    index={i}
                                    playlist={playlist}
                                    range={scrollYProgress}
                                    targetScale={targetScale}
                                />
                            )
                        })}
                    </div>
                )}
            </Container>
        </section>
    )
}
