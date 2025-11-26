"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TextScrambleProps {
    children: string
    duration?: number
    speed?: number
    className?: string
    characterSet?: string
}

const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export const TextScramble = ({
    children,
    duration = 0.8,
    speed = 0.04,
    className,
    characterSet = defaultChars,
}: TextScrambleProps) => {
    const [text, setText] = useState(children)
    const [isScrambling, setIsScrambling] = useState(false)

    const scramble = async () => {
        if (isScrambling) return
        setIsScrambling(true)

        const steps = duration / speed
        let step = 0

        const interval = setInterval(() => {
            let scrambled = ""
            const progress = step / steps

            for (let i = 0; i < children.length; i++) {
                if (i < children.length * progress) {
                    scrambled += children[i]
                } else {
                    scrambled += characterSet[Math.floor(Math.random() * characterSet.length)]
                }
            }

            setText(scrambled)
            step++

            if (step > steps) {
                clearInterval(interval)
                setText(children)
                setIsScrambling(false)
            }
        }, speed * 1000)
    }

    useEffect(() => {
        scramble()
    }, [])

    return (
        <motion.span
            className={className}
            onHoverStart={scramble}
        >
            {text}
        </motion.span>
    )
}
