"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { Particles } from "@/components/ui/particles"
import { Meteors } from "@/components/ui/meteors"
import { ArrowLeft, Play, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Playlist } from "@/lib/db"
import { LazyImage } from "@/components/ui/lazy-image"

export default function PlaylistPage() {
    const params = useParams()
    const playlistId = params.id as string
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (playlistId) {
            fetchPlaylist()
        }
    }, [playlistId])

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`/api/playlists/${playlistId}`)
            const result = await response.json()
            if (result.success) {
                setPlaylist(result.data)
            }
        } catch (error) {
            console.error('Error fetching playlist:', error)
        } finally {
            setIsLoading(false)
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
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Loading playlist...</p>
                        </div>
                    ) : !playlist ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Playlist not found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-12">
                                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-6">
                                    <LazyImage
                                        src={playlist.thumbnail}
                                        alt={playlist.title}
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h1 className="text-4xl md:text-6xl font-bold mb-2">
                                            <ShinyText>{playlist.title}</ShinyText>
                                        </h1>
                                        <p className="text-muted-foreground">
                                            {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {playlist.videos.length === 0 ? (
                                <div className="text-center py-20 rounded-2xl bg-background/50 backdrop-blur-sm border border-white/10">
                                    <p className="text-muted-foreground">No videos in this playlist yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {playlist.videos.map((video, index) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-colors group"
                                        >
                                            <div className="relative aspect-video">
                                                <LazyImage
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <motion.a
                                                        href={video.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-4 rounded-full bg-primary text-white"
                                                    >
                                                        <Play className="w-6 h-6 fill-white" />
                                                    </motion.a>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                    {video.description}
                                                </p>
                                                <a
                                                    href={video.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                                >
                                                    Watch Video <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </Container>
        </section>
    )
}
