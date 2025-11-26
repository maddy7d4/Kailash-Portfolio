"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Magnetic } from "@/components/ui/magnetic"
import { useScrollSound } from "@/hooks/use-scroll-sound"
import { Volume2, VolumeX } from "lucide-react"

const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
]

export function Header() {
    const { scrollY } = useScroll()
    const [hidden, setHidden] = useState(false)
    const { isMuted, toggleMute } = useScrollSound()

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0
        if (latest > previous && latest > 150) {
            setHidden(true)
        } else {
            setHidden(false)
        }
    })

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 py-4"
        >
            <Container>
                <div className="flex items-center justify-between p-2 rounded-full bg-background/50 backdrop-blur-md border border-border shadow-lg">
                    <Link href="/" className="px-4 font-bold text-xl tracking-tighter">
                        KAILAS
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Magnetic key={link.name}>
                                <Link
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </Magnetic>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 px-2">
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                            aria-label={isMuted ? "Unmute scroll sound" : "Mute scroll sound"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </Container>
        </motion.header>
    )
}
