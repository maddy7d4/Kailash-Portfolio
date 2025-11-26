"use client"

import { useEffect, useState, useRef } from "react"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { useSoundContext } from "@/context/sound-context"

export function useScrollSound() {
    const { scrollY } = useScroll()
    const [isMuted, setIsMuted] = useState(false)
    const { activeProfile } = useSoundContext()

    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)
    const gainNodeRef = useRef<GainNode | null>(null)
    const isInitializedRef = useRef(false)

    // Initialize Audio Engine
    useEffect(() => {
        const initAudio = () => {
            if (isInitializedRef.current) return

            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
                audioContextRef.current = new AudioContextClass()

                // Create Gain Node (Volume Control)
                gainNodeRef.current = audioContextRef.current.createGain()
                gainNodeRef.current.connect(audioContextRef.current.destination)
                gainNodeRef.current.gain.value = 0 // Start silent

                // Create Persistent Oscillator
                oscillatorRef.current = audioContextRef.current.createOscillator()
                oscillatorRef.current.type = activeProfile.type
                oscillatorRef.current.connect(gainNodeRef.current)
                oscillatorRef.current.start()

                isInitializedRef.current = true
                console.log("Audio Engine Initialized")
            } catch (error) {
                console.error("Failed to initialize audio engine:", error)
            }
        }

        const handleInteraction = () => {
            if (!isInitializedRef.current) {
                initAudio()
            }
            // Always try to resume context on interaction
            if (audioContextRef.current?.state === "suspended") {
                audioContextRef.current.resume()
            }
        }

        window.addEventListener("click", handleInteraction)
        window.addEventListener("scroll", handleInteraction)
        window.addEventListener("touchstart", handleInteraction)

        return () => {
            window.removeEventListener("click", handleInteraction)
            window.removeEventListener("scroll", handleInteraction)
            window.removeEventListener("touchstart", handleInteraction)

            if (oscillatorRef.current) {
                try {
                    oscillatorRef.current.stop()
                    oscillatorRef.current.disconnect()
                } catch (e) {
                    // Ignore errors on cleanup
                }
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    // Update oscillator type when profile changes
    useEffect(() => {
        if (oscillatorRef.current && audioContextRef.current) {
            // Smooth transition for type change isn't directly supported, 
            // but we can just switch it.
            oscillatorRef.current.type = activeProfile.type
        }
    }, [activeProfile])

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (isMuted || !audioContextRef.current || !gainNodeRef.current || !oscillatorRef.current) {
            return
        }

        const velocity = Math.abs(scrollY.getVelocity())

        // Very low threshold for responsiveness
        if (velocity > 1) {
            // Map velocity to frequency range defined by profile
            // Use a logarithmic scale for more natural pitch changes
            const velocityFactor = Math.min(velocity / 2000, 1)
            const freqRange = activeProfile.maxFreq - activeProfile.minFreq
            const frequency = activeProfile.minFreq + (freqRange * velocityFactor)

            // Volume based on velocity
            // Smooth ramp up
            const targetGain = Math.min(velocityFactor * 0.5 + 0.05, activeProfile.gain)

            const now = audioContextRef.current.currentTime
            oscillatorRef.current.frequency.setTargetAtTime(frequency, now, 0.1)
            gainNodeRef.current.gain.setTargetAtTime(targetGain, now, 0.1)

            // Debug log (throttled ideally, but simple for now)
            if (Math.random() > 0.95) {
                console.log(`Sound Active: Freq=${frequency.toFixed(0)}, Gain=${targetGain.toFixed(3)}`)
            }
        } else {
            // Fade out when stopped
            if (gainNodeRef.current) {
                const now = audioContextRef.current.currentTime
                gainNodeRef.current.gain.setTargetAtTime(0, now, 0.2)
            }
        }
    })

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (!isMuted && gainNodeRef.current && audioContextRef.current) {
            // Immediately silence if muting
            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime)
        }
    }

    return { isMuted, toggleMute }
}
