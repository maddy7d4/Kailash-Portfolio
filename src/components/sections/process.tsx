"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { MagicCard } from "@/components/ui/magic-card"
import { SoundTrigger } from "@/components/ui/sound-trigger"

const steps = [
    {
        number: "01",
        title: "Discovery",
        description: "Understanding your vision, goals, and target audience."
    },
    {
        number: "02",
        title: "Assembly",
        description: "Selecting the best takes and building the narrative structure."
    },
    {
        number: "03",
        title: "Refinement",
        description: "Adding transitions, effects, color grading, and sound design."
    },
    {
        number: "04",
        title: "Delivery",
        description: "Final polish and export in your required formats."
    }
]

export function Process() {
    return (
        <section id="process" className="py-32 bg-background relative overflow-hidden">
            <SoundTrigger profile="process" />
            <Container>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-24 text-center"
                >
                    <ShinyText>Workflow</ShinyText>
                </motion.h2>

                <TracingBeam className="px-6">
                    <div className="relative grid grid-cols-1 gap-12">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="relative"
                            >
                                <MagicCard className="p-8 md:p-12 flex flex-col gap-4 items-start" gradientColor="#262626">
                                    <div className="text-4xl md:text-6xl font-bold text-muted-foreground/20">
                                        {step.number}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                                    <p className="text-lg text-muted-foreground">{step.description}</p>
                                </MagicCard>
                            </motion.div>
                        ))}
                    </div>
                </TracingBeam>
            </Container>
        </section>
    )
}
