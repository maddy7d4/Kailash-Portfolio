"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading time or wait for window load
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        const handleLoad = () => {
            setIsLoading(false)
        }

        if (document.readyState === "complete") {
            // If already loaded, still wait a bit for effect
        } else {
            window.addEventListener("load", handleLoad)
        }

        return () => {
            clearTimeout(timer)
            window.removeEventListener("load", handleLoad)
        }
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                >
                    <div className="flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold tracking-tighter"
                        >
                            KAILAS
                        </motion.div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 200 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-1 bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
