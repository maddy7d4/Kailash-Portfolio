"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function TextReveal({ children, className }: { children: string, className?: string }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    const words = children.split(" ")

    return (
        <span ref={ref} className={className}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] align-bottom">
                    <motion.span
                        initial={{ y: "100%" }}
                        animate={isInView ? { y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.02 * i, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    )
}
