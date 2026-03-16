"use client"

import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { cn } from "@/lib/utils"

interface LazyImageProps {
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
}

export function LazyImage({ src, alt, className, style }: LazyImageProps) {
    return (
        <LazyLoadImage
            src={src}
            alt={alt}
            effect="blur"
            threshold={200}
            style={{ width: "100%", height: "100%", ...style }}
            wrapperProps={{ style: { width: "100%", height: "100%", display: "block" } }}
            className={cn("object-cover", className)}
        />
    )
}
