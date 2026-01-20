import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';

// 3D Model that follows mouse position
function PlantModel({ modelPath, mousePosition }) {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef();
    const targetRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Map mouse position (-1 to 1) to rotation (-0.5 to 0.5 radians)
        targetRotation.current = {
            x: mousePosition.y * 0.3,
            y: mousePosition.x * 0.5
        };
    }, [mousePosition]);

    useFrame((state, delta) => {
        if (modelRef.current) {
            // Smooth interpolation to target rotation
            modelRef.current.rotation.x += (targetRotation.current.x - modelRef.current.rotation.x) * 0.1;
            modelRef.current.rotation.y += (targetRotation.current.y - modelRef.current.rotation.y) * 0.1;
        }
    });

    return (
        <Center>
            <primitive
                ref={modelRef}
                object={scene.clone()}
                scale={1.2}
                position={[0, -0.3, 0]}
            />
        </Center>
    );
}

// Loading fallback - simple spinner
function LoadingFallback() {
    return null; // Transparent loading for smooth experience
}

// Main Preview Component
export default function PlantModelPreview({ modelPath, isHovered }) {
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        setMousePosition({ x, y });
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{ position: [0, 1, 4], fov: 40 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    {/* Lighting */}
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <directionalLight position={[-5, 3, -5]} intensity={0.4} />

                    {/* Environment for nice reflections */}
                    <Environment preset="forest" />

                    {/* Plant Model */}
                    <PlantModel modelPath={modelPath} mousePosition={mousePosition} />
                </Suspense>
            </Canvas>
        </div>
    );
}
