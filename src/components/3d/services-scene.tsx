"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Icosahedron } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function FloatingShape({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x += 0.01 * speed
        meshRef.current.rotation.y += 0.01 * speed
    })

    return (
        <Float speed={speed} rotationIntensity={2} floatIntensity={2}>
            <Icosahedron args={[1, 0]} position={position} ref={meshRef} scale={[0.8, 0.8, 0.8]}>
                <meshStandardMaterial color={color} wireframe />
            </Icosahedron>
        </Float>
    )
}

export function ServicesScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            <Canvas camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FloatingShape position={[-4, 2, 0]} color="#3b82f6" speed={1.5} />
                <FloatingShape position={[4, -2, -2]} color="#a855f7" speed={2} />
                <FloatingShape position={[0, 4, -5]} color="#ec4899" speed={1} />
                <FloatingShape position={[-2, -4, -3]} color="#14b8a6" speed={1.2} />
                <FloatingShape position={[3, 1, 2]} color="#f59e0b" speed={1.8} />
                <FloatingShape position={[5, 3, -4]} color="#ef4444" speed={1.4} />
            </Canvas>
        </div>
    )
}
