"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

export const Dock = ({
    items,
    className,
}: {
    items: { title: string; icon: React.ReactNode; href: string }[]
    className?: string
}) => {
    const mouseX = useMotionValue(Infinity)

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-gray-50/10 px-4 pb-3 backdrop-blur-md border border-white/10",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    )
}

function IconContainer({
    mouseX,
    title,
    icon,
    href,
}: {
    mouseX: any
    title: string
    icon: React.ReactNode
    href: string
}) {
    const ref = useRef<HTMLDivElement>(null)

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
    const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })
    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })

    return (
        <a href={href}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                className="aspect-square rounded-full bg-gray-200/20 flex items-center justify-center relative group"
            >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-auto px-2 py-1 rounded bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {title}
                </span>
                {icon}
            </motion.div>
        </a>
    )
}
