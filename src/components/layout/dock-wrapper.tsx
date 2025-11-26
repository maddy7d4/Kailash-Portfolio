"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Home, MonitorPlay, Scissors, User, Mail } from "lucide-react"

export function DockWrapper() {
    const { scrollY } = useScroll()
    const [visible, setVisible] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0
        // Header hides when scrolling down > 150px. 
        // Dock should SHOW when header is HIDDEN.
        // So if latest > previous && latest > 150, Header hides, Dock shows.
        if (latest > previous && latest > 150) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    })

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
                        <AnimatedTooltip
                            items={[
                                { id: 1, name: "Home", designation: "Go to top", image: "", icon: <Home className="w-5 h-5" />, href: "#" },
                                { id: 2, name: "Work", designation: "My Projects", image: "", icon: <MonitorPlay className="w-5 h-5" />, href: "#work" },
                                { id: 3, name: "Services", designation: "What I do", image: "", icon: <Scissors className="w-5 h-5" />, href: "#services" },
                                { id: 4, name: "About", designation: "Who I am", image: "", icon: <User className="w-5 h-5" />, href: "#about" },
                                { id: 5, name: "Contact", designation: "Get in touch", image: "", icon: <Mail className="w-5 h-5" />, href: "#contact" },
                            ]}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
