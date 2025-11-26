import { cn } from "@/lib/utils"

export function Container({
    className,
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={cn("mx-auto max-w-7xl px-6 md:px-12 lg:px-24", className)}>
            {children}
        </div>
    )
}
