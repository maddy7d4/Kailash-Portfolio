"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function Cursor() {
    const [isHovered, setIsHovered] = useState(false)
    const cursorSize = isHovered ? 80 : 20

    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0)
    }

    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 }
    const smoothMouse = {
        x: useSpring(mouse.x, smoothOptions),
        y: useSpring(mouse.y, smoothOptions)
    }

    const manageMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        mouse.x.set(clientX - cursorSize / 2)
        mouse.y.set(clientY - cursorSize / 2)
    }

    const manageMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
            setIsHovered(true)
        } else {
            setIsHovered(false)
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", manageMouseMove)
        window.addEventListener("mouseover", manageMouseOver)
        return () => {
            window.removeEventListener("mousemove", manageMouseMove)
            window.removeEventListener("mouseover", manageMouseOver)
        }
    }, [cursorSize]) // Re-bind when size changes to update offset

    return (
        <motion.div
            style={{
                left: smoothMouse.x,
                top: smoothMouse.y,
                width: cursorSize,
                height: cursorSize
            }}
            className="fixed z-50 rounded-full bg-white mix-blend-difference pointer-events-none hidden md:block"
        />
    )
}
