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
            oscillatorRef.current.type = activeProfile.type
        }
    }, [activeProfile])

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (isMuted || !audioContextRef.current || !gainNodeRef.current || !oscillatorRef.current) {
            return
        }

        const velocity = Math.abs(scrollY.getVelocity())

        // Increased threshold to prevent noise when stationary
        if (velocity > 10) {
            // Map velocity to frequency range defined by profile
            // Use a logarithmic scale for more natural pitch changes
            const velocityFactor = Math.min(velocity / 2000, 1)
            const freqRange = activeProfile.maxFreq - activeProfile.minFreq
            const frequency = activeProfile.minFreq + (freqRange * velocityFactor)

            // Volume based on velocity
            // Strictly proportional to velocity, no base floor
            const targetGain = Math.min(velocityFactor * 0.8, activeProfile.gain)

            const now = audioContextRef.current.currentTime
            oscillatorRef.current.frequency.setTargetAtTime(frequency, now, 0.1)
            gainNodeRef.current.gain.setTargetAtTime(targetGain, now, 0.1)

            // Debug log (throttled ideally, but simple for now)
            if (Math.random() > 0.95) {
                console.log(`Sound Active: Freq=${frequency.toFixed(0)}, Gain=${targetGain.toFixed(3)}`)
            }
        } else {
            // Fade out quickly when stopped
            if (gainNodeRef.current) {
                const now = audioContextRef.current.currentTime
                // Faster fade out (0.1s)
                gainNodeRef.current.gain.setTargetAtTime(0, now, 0.1)
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
