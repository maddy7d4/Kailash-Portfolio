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
                "text-muted-foreground bg-clip-text inline-block",
                disabled ? "" : "animate-shine",
                className
            )}
            style={{
                backgroundImage: "var(--shiny-gradient)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                animationDuration: animationDuration,
                color: "var(--shiny-text-color)",
            }}
        >
            {children}
        </div>
    )
}
