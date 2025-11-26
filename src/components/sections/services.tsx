"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Scissors, Music, MonitorPlay, Palette } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight"
import { ShinyText } from "@/components/ui/shiny-text"
import { SoundTrigger } from "@/components/ui/sound-trigger"
import { ServicesScene } from "@/components/3d/services-scene"

const services = [
    {
        icon: Scissors,
        title: "Video Editing",
        description: "Crafting seamless narratives from raw footage with precision cuts and pacing."
    },
    {
        icon: Palette,
        title: "Color Grading",
        description: "Enhancing mood and atmosphere through professional color correction and grading."
    },
    {
        icon: Music,
        title: "Sound Design",
        description: "Immersive audio soundscapes that elevate the visual experience."
    },
    {
        icon: MonitorPlay,
        title: "Motion Graphics",
        description: "Dynamic text and visual effects to add polish and engagement."
    }
]

export function Services() {
    return (
        <section id="services" className="py-32 bg-secondary/30 relative overflow-hidden">
            <SoundTrigger profile="services" />
            <ServicesScene />
            <Container>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-16 text-center"
                >
                    <ShinyText>Services</ShinyText>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <SpotlightCard key={i} className="bg-background/50 backdrop-blur-sm border-white/5">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative z-20 p-8 h-full w-full"
                            >
                                <div className="mb-6 p-4 rounded-full bg-secondary w-fit group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                                <p className="text-muted-foreground">{service.description}</p>
                            </motion.div>
                        </SpotlightCard>
                    ))}
                </div>
            </Container>
        </section>
    )
}
