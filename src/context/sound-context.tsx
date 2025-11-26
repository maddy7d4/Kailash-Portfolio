"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type SoundProfile = {
    type: OscillatorType
    minFreq: number
    maxFreq: number
    gain: number
}

export const SOUND_PROFILES: Record<string, SoundProfile> = {
    hero: { type: "sine", minFreq: 100, maxFreq: 400, gain: 0.15 }, // Increased gain
    work: { type: "triangle", minFreq: 50, maxFreq: 200, gain: 0.12 }, // Increased gain
    services: { type: "square", minFreq: 200, maxFreq: 600, gain: 0.08 }, // Increased gain
    process: { type: "sawtooth", minFreq: 100, maxFreq: 300, gain: 0.1 }, // Increased gain
    about: { type: "sine", minFreq: 300, maxFreq: 800, gain: 0.12 }, // Increased gain
    contact: { type: "sine", minFreq: 50, maxFreq: 150, gain: 0.18 }, // Increased gain
}

type SoundContextType = {
    activeProfile: SoundProfile
    setProfile: (profileName: keyof typeof SOUND_PROFILES) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
    const [activeProfile, setActiveProfile] = useState<SoundProfile>(SOUND_PROFILES.hero)

    const setProfile = (profileName: keyof typeof SOUND_PROFILES) => {
        setActiveProfile(SOUND_PROFILES[profileName])
    }

    return (
        <SoundContext.Provider value={{ activeProfile, setProfile }}>
            {children}
        </SoundContext.Provider>
    )
}

export function useSoundContext() {
    const context = useContext(SoundContext)
    if (context === undefined) {
        throw new Error("useSoundContext must be used within a SoundProvider")
    }
    return context
}
