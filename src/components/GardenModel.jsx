/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SelectionRing from './SelectionRing';

const PLANT_NAMES = [
    'aloevera',
    'ashwagandha',
    'basil',
    'lavender',
    'neem',
    'peepal',
    'tulsi'
];

// Custom offsets for specific plants
// Default is [1, 0.8, 1]
const PLANT_CONFIG = {
    aloevera: { ringYOffset: 0.08 },
    basil: { offset: [1, 0.8, -1] }, // View from the left/right flip
    lavender: { offset: [-1, 0.8, -1], ringYOffset: 0.01 },
    neem: { offset: [1, 0.8, 1], zoomMultiplier: 1.3 }, // Zoom out for trees
    peepal: { ringYOffset: 0.5, offset: [-0.46, 0.57, 0.68], zoomMultiplier: 1, targetOffset: [0, 0.19, 0] }, // Lift focus up by 2 units
    tulsi: { targetOffset: [0, 0.05, 0] },
    neem: { ringYOffset: 0.1 },
};

export default function GardenModel({ currentPlant, onPlantsLoaded }) {
    const { scene } = useGLTF('/models/varun_ka_garden.glb');
    const cameraControlsRef = useRef();
    const [plantNodes, setPlantNodes] = useState({});
    const [ringProps, setRingProps] = useState(null); // { position, radius }
    const { camera } = useThree();

    // Find the plant nodes in the scene
    useEffect(() => {
        console.log('Scene loaded:', scene);
        const nodes = {};

        scene.traverse((object) => {
            // Check ALL objects, not just meshes/groups
            const lowerName = object.name.toLowerCase();
            const found = PLANT_NAMES.find(name => lowerName.includes(name));
            if (found) {
                console.log('MATCHED:', found, '->', object.name, 'Type:', object.type);
                nodes[found] = object;
            }
        });

        console.log('Final Plant Nodes Map:', nodes);
        setPlantNodes(nodes);

        if (onPlantsLoaded) {
            onPlantsLoaded(Object.keys(nodes));
        }
    }, [scene, onPlantsLoaded]);

    // Handle camera transitions AND ring position
    useEffect(() => {
        if (cameraControlsRef.current && currentPlant && plantNodes[currentPlant]) {
            const targetNode = plantNodes[currentPlant];

            const box = new THREE.Box3().setFromObject(targetNode);
            if (box.isEmpty()) {
                targetNode.traverse((child) => {
                    if (child.isMesh) {
                        box.expandByObject(child);
                    }
                });
            }

            if (!box.isEmpty()) {
                const center = new THREE.Vector3();
                const size = new THREE.Vector3();

                box.getCenter(center);
                box.getSize(size);

                const maxDim = Math.max(size.x, size.y, size.z);

                // Determine offset and zoom based on plant config
                // Default: [1, 0.8, 1]
                const config = PLANT_CONFIG[currentPlant] || {};

                // Update Ring Props using the box dimensions
                // Position at the bottom of the box (ground level-ish)
                // Add a small Y offset to avoid z-fighting
                // Default offset is 0.05, can be overridden by config
                const ringYOffset = config.ringYOffset !== undefined ? config.ringYOffset : 0.05;
                const groundY = box.min.y + ringYOffset;

                setRingProps({
                    position: [center.x, groundY, center.z],
                    radius: Math.max(size.x, size.z) / 2 + 0.05 // slightly larger than the plant width
                });

                const baseOffset = config.offset ? new THREE.Vector3(...config.offset) : new THREE.Vector3(1, 0.8, 1);

                // Base distance logic (Tight zoom default)
                // Multiplier allows zooming OUT (e.g., 2.0) or IN (0.5)
                const zoomMultiplier = config.zoomMultiplier || 1.0;
                const distance = (maxDim * 0.6 + 0.3) * zoomMultiplier;

                const offset = baseOffset.normalize().multiplyScalar(distance);

                // Apply optional target offset (e.g. to lift focus up the tree)
                if (config.targetOffset) {
                    center.add(new THREE.Vector3(...config.targetOffset));
                }

                const cameraPosition = center.clone().add(offset);

                cameraControlsRef.current.setLookAt(
                    cameraPosition.x, cameraPosition.y, cameraPosition.z,
                    center.x, center.y, center.z,
                    true // enable transition
                );
            }
        }
    }, [currentPlant, plantNodes]);

    // Log camera position for debugging/calibration
    useEffect(() => {
        const controls = cameraControlsRef.current;
        if (!controls || !currentPlant || !plantNodes[currentPlant]) return;

        const targetNode = plantNodes[currentPlant];
        const box = new THREE.Box3().setFromObject(targetNode);
        // Expand box logic (same as above to ensure center is correct)
        if (box.isEmpty()) {
            targetNode.traverse((child) => {
                if (child.isMesh) {
                    box.expandByObject(child);
                }
            });
        }
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);


        const onUpdate = () => {
            const cameraPos = camera.position.clone();
            const relVector = cameraPos.sub(center); // Vector from Object Center to Camera
            const dist = relVector.length();
            const dir = relVector.normalize();

            // Calculate approximate zoom multiplier based on our formula: dist = (maxDim * 0.6 + 0.3) * multiplier
            const baseDist = (maxDim * 0.6 + 0.3);
            const approxMultiplier = dist / baseDist;

            // Limit excessive logging
            // console.log(`
            // [${currentPlant}] Calibration:
            // Offset (Direction): [${dir.x.toFixed(2)}, ${dir.y.toFixed(2)}, ${dir.z.toFixed(2)}]
            // Distance: ${dist.toFixed(2)}
            // Approx ZoomMultiplier: ${approxMultiplier.toFixed(3)}
            // `);
        };

        // Use standard event listener
        controls.addEventListener('update', onUpdate);

        return () => {
            controls.removeEventListener('update', onUpdate);
        };
    }, [currentPlant, plantNodes, camera]);

    return (
        <>
            <primitive object={scene} />

            {/* Selection Ring */}
            {ringProps && (
                <SelectionRing
                    position={ringProps.position}
                    radius={ringProps.radius}
                />
            )}

            <CameraControls
                ref={cameraControlsRef}
                makeDefault
                enabled={false}
            /* Re-enabled for calibration: */
            // mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
            // touches={{ one: 0, two: 0, three: 0 }}
            // truckSpeed={0}
            // dollySpeed={0}
            // azimuthRotateSpeed={0}
            // polarRotateSpeed={0}
            // minZoom={0}
            // maxZoom={0}
            />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        </>
    );
}

useGLTF.preload('/models/varun_ka_garden.glb');
