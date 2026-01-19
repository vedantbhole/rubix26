import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ScrollPlantAnimation({ progress }) {
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Discover frames by actually trying to load images
  useEffect(() => {
    const discoverFrames = async () => {
      const discoveredFrames = [];
      let frameIndex = 0;
      let consecutiveFailures = 0;

      const tryLoadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        });
      };

      while (consecutiveFailures < 2 && frameIndex < 300) {
        const paddedIndex = String(frameIndex).padStart(3, '0');
        const framePath = `/frames/frame_${paddedIndex}.jpg`;

        const loaded = await tryLoadImage(framePath);

        if (loaded) {
          discoveredFrames.push(framePath);
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
        }
        frameIndex++;
      }

      if (discoveredFrames.length > 0) {
        setFrames(discoveredFrames);
      }
      setIsLoading(false);
    };

    discoverFrames();
  }, []);

  const currentFrameIndex = useMemo(() => {
    if (frames.length === 0) return 0;
    const index = Math.floor(progress * (frames.length - 1));
    return Math.min(Math.max(0, index), frames.length - 1);
  }, [progress, frames.length]);

  const currentFrame = frames[currentFrameIndex];

  return (
    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: '#000000' }}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mb-4"
            style={{ borderTopColor: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }} />
          <p className="font-medium" style={{ color: '#4ade80' }}>
            Loading...
          </p>
        </div>
      )}

      {/* Full-screen Frame Display - zoomed out slightly */}
      {!isLoading && currentFrame && (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={currentFrame}
            alt="Plant growth animation"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // Show entire image without cropping
              transform: 'scale(0.85)', // Zoom out slightly
              transformOrigin: 'center center'
            }}
          />
        </div>
      )}

      {/* Fallback if no frames found */}
      {!isLoading && frames.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#666' }}>
          <div className="text-center">
            <p>No frames found in /frames folder</p>
            <p className="text-sm mt-2">Add frame_000.jpg, frame_001.jpg, etc.</p>
          </div>
        </div>
      )}

      {/* Growth indicator */}
      {!isLoading && frames.length > 0 && (
        <div className="absolute bottom-8 right-8 text-right z-40">
          <motion.div
            className="font-bold text-2xl mb-2"
            style={{ color: '#4ade80', fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress * 100)}% Grown
          </motion.div>
          <div className="w-40 h-2 rounded-full overflow-hidden ml-auto" style={{ backgroundColor: 'rgba(34, 34, 34, 0.8)' }}>
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(to right, #16a34a, #4ade80)'
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Frame {currentFrameIndex + 1} / {frames.length}
          </p>
        </div>
      )}
    </div>
  );
}
