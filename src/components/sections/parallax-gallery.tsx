"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Container } from "@/components/ui/container"

const images = [
    "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
]

export function ParallaxGallery() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])

    return (
        <section ref={container} className="py-32 bg-background overflow-hidden">
            <Container className="mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-center">Visual Playground</h2>
            </Container>

            <div className="h-[800px] flex gap-8 justify-center overflow-hidden">
                <motion.div style={{ y: y1 }} className="flex flex-col gap-8 w-1/4">
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[1]} className="w-full h-full object-cover" alt="" />
                    </div>
                </motion.div>

                <motion.div style={{ y: y2 }} className="flex flex-col gap-8 w-1/4 pt-20">
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[2]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[3]} className="w-full h-full object-cover" alt="" />
                    </div>
                </motion.div>

                <motion.div style={{ y: y3 }} className="flex flex-col gap-8 w-1/4">
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[4]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="h-[400px] rounded-2xl overflow-hidden">
                        <img src={images[5]} className="w-full h-full object-cover" alt="" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
