import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model() {
    const movingPC = useGLTF('/animated_airplane.glb')
    return <primitive object={movingPC.scene} scale={0.5} />
}

export const ThreeScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <directionalLight position={[0, 5, 5]} />
            <OrbitControls />
            <Model />
        </Canvas>
    )
}