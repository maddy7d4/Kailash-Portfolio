"use client"

import { cn } from "@/lib/utils"

interface ShinyTextProps {
    children: React.ReactNode
    disabled?: boolean
    speed?: number
    className?: string
}

export function ShinyText({
    children,
    disabled = false,
    speed = 5,
    className,
}: ShinyTextProps) {
    const animationDuration = `${speed}s`

    return (
        <div
            className={cn(
                "text-[#b5b5b5a4] bg-clip-text inline-block",
                disabled ? "" : "animate-shine",
                className
            )}
            style={{
                backgroundImage:
                    "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                animationDuration: animationDuration,
            }}
        >
            {children}
        </div>
    )
}
