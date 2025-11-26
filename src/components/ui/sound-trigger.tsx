"use client"

import { useEffect } from "react"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useSoundContext, SOUND_PROFILES } from "@/context/sound-context"

export function SoundTrigger({ profile }: { profile: keyof typeof SOUND_PROFILES }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" }) // Trigger when center of section is in view
    const { setProfile } = useSoundContext()

    useEffect(() => {
        if (isInView) {
            setProfile(profile)
        }
    }, [isInView, profile, setProfile])

    return <div ref={ref} className="absolute inset-0 pointer-events-none" />
}
