"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useSpring, useMotionTemplate, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export const Spotlight = ({
    className,
    fill = "white",
}: {
    className?: string
    fill?: string
}) => {
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <motion.div
            className={cn(
                "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100",
                className
            )}
            onMouseMove={onMouseMove}
            style={{
                background: useMotionTemplate`
          radial-gradient(
            650px circle at ${mouseX}px ${mouseY}px,
            ${fill},
            transparent 80%
          )
        `,
            }}
        />
    )
}

export function SpotlightCard({
    children,
    className = "",
}: {
    children: React.ReactNode
    className?: string
}) {
    const divRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return

        const div = divRef.current
        const rect = div.getBoundingClientRect()

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleFocus = () => {
        setIsFocused(true)
        setOpacity(1)
    }

    const handleBlur = () => {
        setIsFocused(false)
        setOpacity(0)
    }

    const handleMouseEnter = () => {
        setOpacity(1)
    }

    const handleMouseLeave = () => {
        setOpacity(0)
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-slate-200",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
                }}
            />
            {children}
        </div>
    )
}
