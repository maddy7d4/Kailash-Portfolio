"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute h-full w-full inset-0 bg-neutral-950",
                className
            )}
        >
            <div className="absolute h-full w-full inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute h-[100%] w-full inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute h-full w-full inset-0 opacity-40">
                <div className="absolute -left-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-purple-500 blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute right-[10%] bottom-[20%] h-[30%] w-[30%] rounded-full bg-blue-500 blur-[120px] opacity-20 animate-pulse delay-1000"></div>
            </div>
            <div className="absolute inset-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
    );
};
