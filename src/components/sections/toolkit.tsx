"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { ShinyText } from "@/components/ui/shiny-text"
import { BlurFade } from "@/components/ui/blur-fade"

const tools = [
    {
        name: "Premiere Pro",
        category: "Video Editing",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/2101px-Adobe_Premiere_Pro_CC_icon.svg.png",
    },
    {
        name: "After Effects",
        category: "Motion Graphics",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Adobe_After_Effects_CC_icon.svg/2101px-Adobe_After_Effects_CC_icon.svg.png",
    },
    {
        name: "DaVinci Resolve",
        category: "Color Grading",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",
    },
    {
        name: "Blender",
        category: "3D Design",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/2503px-Blender_logo_no_text.svg.png",
    },
    {
        name: "Photoshop",
        category: "Image Editing",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/2101px-Adobe_Photoshop_CC_icon.svg.png",
    },
    {
        name: "Illustrator",
        category: "Vector Graphics",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/2101px-Adobe_Illustrator_CC_icon.svg.png",
    },
    {
        name: "Cinema 4D",
        category: "3D Modeling",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Cinema_4D_Logo.svg/2048px-Cinema_4D_Logo.svg.png",
    },
    {
        name: "Audition",
        category: "Audio Editing",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Adobe_Audition_CC_icon_%282020%29.svg/2048px-Adobe_Audition_CC_icon_%282020%29.svg.png",
    }
]

export function Toolkit() {
    return (
        <section className="py-32 bg-background overflow-hidden">
            <Container className="mb-12">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    <ShinyText>Toolkit</ShinyText>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    My arsenal of industry-standard tools for creating cinematic experiences.
                </p>
            </Container>

            <div className="relative w-full overflow-hidden mask-gradient">
                <div className="flex w-max animate-scroll gap-8 px-8">
                    {[...tools, ...tools].map((tool, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 w-[250px] md:w-[300px]"
                        >
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/20 border border-white/5 hover:border-primary/50 transition-all duration-300 group/card cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center p-12 bg-gradient-to-b from-transparent to-black/80">
                                    <BlurFade delay={0.1} inView>
                                        <img
                                            src={tool.image}
                                            alt={tool.name}
                                            className="w-full h-full object-contain drop-shadow-2xl group-hover/card:scale-110 transition-transform duration-500"
                                        />
                                    </BlurFade>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h3 className="text-xl font-bold text-white mb-1">{tool.name}</h3>
                                    <p className="text-sm text-white/60">{tool.category}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
