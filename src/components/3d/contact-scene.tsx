"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { TorusKnot, MeshWobbleMaterial } from "@react-three/drei"
import { useRef, useState } from "react"
import * as THREE from "three"

function InteractiveShape() {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    })

    return (
        <TorusKnot
            args={[1, 0.3, 100, 16]}
            ref={meshRef}
            scale={hovered ? 1.2 : 1}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <MeshWobbleMaterial
                color={hovered ? "#ffffff" : "#666666"}
                factor={1}
                speed={2}
                roughness={0.1}
                metalness={0.8}
            />
        </TorusKnot>
    )
}

export function ContactScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <InteractiveShape />
            </Canvas>
        </div>
    )
}
