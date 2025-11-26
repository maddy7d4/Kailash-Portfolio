"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function AnimatedSphere() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.getElapsedTime()
        meshRef.current.rotation.x = time * 0.2
        meshRef.current.rotation.y = time * 0.3
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere args={[1, 64, 64]} ref={meshRef} scale={[2.5, 2.5, 2.5]}>
                <MeshDistortMaterial
                    color="#ffffff"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.1}
                    wireframe
                />
            </Sphere>
        </Float>
    )
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AnimatedSphere />
                <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5} position={[3, 2, -2]}>
                    <Sphere args={[0.5, 32, 32]}>
                        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
                    </Sphere>
                </Float>
                <Float speed={2} rotationIntensity={2} floatIntensity={2} position={[-3, -2, -1]}>
                    <Sphere args={[0.3, 32, 32]}>
                        <meshStandardMaterial color="#a855f7" wireframe transparent opacity={0.2} />
                    </Sphere>
                </Float>
            </Canvas>
        </div>
    )
}
