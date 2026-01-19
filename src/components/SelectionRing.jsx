import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ring } from '@react-three/drei';

export default function SelectionRing({ position, radius = 1.5 }) {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            // Rotate slowly
            ringRef.current.rotation.z += 0.01;
            // Pulse scale
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            ringRef.current.scale.set(scale, scale, 1);
        }
    });

    return (
        <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Outer Ring */}
            <Ring
                ref={ringRef}
                args={[radius * 0.9, radius, 32]}
                receiveShadow
            >
                <meshBasicMaterial color="#ffffffff" transparent opacity={0.6} side={2} />
            </Ring>

            {/* Inner Glow (Optional, simulated with another ring or opacity) */}
            <Ring args={[radius * 0.85, radius * 0.9, 32]}>
                <meshBasicMaterial color="#ffffffff" transparent opacity={0.2} side={2} />
            </Ring>
        </group>
    );
}
