import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GardenModel from '../components/GardenModel';
import Navbar from '../components/Navbar';

const PLANT_DATA = {
    aloevera: {
        name: 'Aloe Vera',
        description: 'A succulent plant species of the genus Aloe. It is widely used in cosmetics and alternative medicine due to its rejuvenate, healing, and soothing properties.'
    },
    ashwagandha: {
        name: 'Ashwagandha',
        description: 'An evergreen shrub used in traditional Indian Ayurvedic medicine. It is commonly known as "Indian Winter cherry" or "Indian Ginseng".'
    },
    basil: {
        name: 'Basil',
        description: 'A culinary herb of the family Lamiaceae (mints). It is native to tropical regions from central Africa to Southeast Asia.'
    },
    lavender: {
        name: 'Lavender',
        description: 'Known for its color, fragrance, and multiple uses. It is a flowering plant in the mint family, Lamiaceae, native to the Old World.'
    },
    neem: {
        name: 'Neem',
        description: 'A rapidly growing tree that typically reaches a height of 15–20 metres. It is known for its medicinal properties in Ayurveda.'
    },
    peepal: {
        name: 'Peepal',
        description: 'Ficus religiosa or sacred fig is a species of fig native to the Indian subcontinent and Indochina that belongs to the Moraceae, the fig or mulberry family.'
    },
    tulsi: {
        name: 'Tulsi',
        description: 'Ocimum tenuiflorum, commonly known as holy basil or tulsi, is an aromatic perennial plant in the family Lamiaceae.'
    }
};

const PLANT_KEYS = Object.keys(PLANT_DATA);

export default function GardenTour() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentPlantKey = PLANT_KEYS[currentIndex];
    const currentPlantInfo = PLANT_DATA[currentPlantKey];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % PLANT_KEYS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + PLANT_KEYS.length) % PLANT_KEYS.length);
    };

    return (
        <div className='w-full h-screen bg-black text-white overflow-hidden relative'>
            <Navbar />

            {/* 3D Scene */}
            <div className='absolute inset-0 z-0'>
                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <GardenModel currentPlant={currentPlantKey} />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className='absolute bottom-10 left-10 right-10 z-10 flex flex-col md:flex-row items-end justify-between pointer-events-none'>

                {/* Plant Description Card */}
                <div className='neo-brutalism-white bg-black/50 backdrop-blur-md border border-white/20 p-6 max-w-md pointer-events-auto mb-4 md:mb-0 text-white'>
                    <h2 className='text-3xl font-bold font-satoshi text-white mb-2'>
                        {currentPlantInfo.name}
                    </h2>
                    <p className='text-gray-200 font-general'>
                        {currentPlantInfo.description}
                    </p>
                </div>

                {/* Navigation Controls */}
                <div className='flex gap-4 pointer-events-auto'>
                    <button
                        onClick={handlePrev}
                        className='p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all'
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={handleNext}
                        className='p-4 bg-[#D4F933] text-black rounded-full hover:bg-[#c2e52d] transition-all'
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
}
