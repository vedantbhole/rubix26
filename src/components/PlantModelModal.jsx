import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ZoomIn } from 'lucide-react';

// 3D Model Component
function PlantModel({ modelPath }) {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef();

    // Gentle auto-rotation when not interacting
    useFrame((state, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <Center>
            <primitive
                ref={modelRef}
                object={scene}
                scale={1.5}
                position={[0, -0.5, 0]}
            />
        </Center>
    );
}

// Loading fallback
function LoadingSpinner() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-herb-500/30 border-t-herb-500 rounded-full animate-spin" />
                <p className="text-herb-400 text-sm font-medium">Loading 3D Model...</p>
            </div>
        </Html>
    );
}

// Main Modal Component
export default function PlantModelModal({ isOpen, onClose, plantName, modelPath }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-md" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl h-[80vh] bg-dark-800 rounded-3xl overflow-hidden border border-herb-500/20 shadow-2xl shadow-herb-500/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-dark-800 via-dark-800/80 to-transparent">
                            <div>
                                <h2 className="font-display font-bold text-2xl text-white">{plantName}</h2>
                                <p className="text-herb-400 text-sm">Interactive 3D Model</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 3D Canvas */}
                        <div className="w-full h-full">
                            <Canvas
                                camera={{ position: [0, 2, 5], fov: 45 }}
                                style={{ background: 'transparent' }}
                            >
                                <Suspense fallback={<LoadingSpinner />}>
                                    {/* Lighting */}
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[10, 10, 5]} intensity={1} />
                                    <directionalLight position={[-10, -10, -5]} intensity={0.3} />
                                    <spotLight position={[0, 10, 0]} intensity={0.5} />

                                    {/* Environment for reflections */}
                                    <Environment preset="forest" />

                                    {/* Plant Model */}
                                    <PlantModel modelPath={modelPath} />

                                    {/* Controls */}
                                    <OrbitControls
                                        enablePan={true}
                                        enableZoom={true}
                                        enableRotate={true}
                                        minDistance={2}
                                        maxDistance={10}
                                        autoRotate={false}
                                        autoRotateSpeed={1}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>

                        {/* Instructions Footer */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-dark-800 via-dark-800/80 to-transparent">
                            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-herb-400" />
                                    <span>Drag to rotate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ZoomIn className="w-4 h-4 text-herb-400" />
                                    <span>Scroll to zoom</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Preload the Tulsi model
useGLTF.preload('/models/tulsi_tree.glb');
