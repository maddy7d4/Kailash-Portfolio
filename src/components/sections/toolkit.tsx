"use client"

import { Container } from "@/components/ui/container"
import { motion } from "framer-motion"
import { ShinyText } from "@/components/ui/shiny-text"
import {
    Monitor,
    Video,
    Mic,
    Camera,
    Clapperboard,
    Film,
    Scissors,
    Layers,
    Cpu,
    HardDrive,
    Speaker
} from "lucide-react"

const tools = [
    { name: "Premiere Pro", icon: Video },
    { name: "After Effects", icon: Layers },
    { name: "DaVinci Resolve", icon: Clapperboard },
    { name: "Audition", icon: Mic },
    { name: "Cinema 4D", icon: Box },
    { name: "Blender", icon: Box },
    { name: "Final Cut Pro", icon: Scissors },
    { name: "Logic Pro", icon: Speaker },
    { name: "Photoshop", icon: Camera },
    { name: "Illustrator", icon: PenTool },
]

// Duplicate tools for infinite scroll
const allTools = [...tools, ...tools, ...tools]

function Box(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}

function PenTool(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    )
}

export function Toolkit() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <Container className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                    <ShinyText>My Toolkit</ShinyText>
                </h2>
                <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                    The software and hardware I use to bring stories to life.
                </p>
            </Container>

            <div className="relative w-full mask-gradient">
                <div className="flex overflow-hidden">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex gap-12 whitespace-nowrap py-8"
                    >
                        {allTools.map((tool, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.2, color: "#fff" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="flex flex-col items-center gap-4 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <tool.icon className="w-12 h-12 md:w-16 md:h-16" />
                                <span className="text-lg font-medium">{tool.name}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
