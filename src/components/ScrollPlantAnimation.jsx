import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ScrollPlantAnimation({ progress }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);

  // Discover and preload all frames
  useEffect(() => {
    const discoverAndPreloadFrames = async () => {
      const discoveredPaths = [];
      let frameIndex = 0;
      let consecutiveFailures = 0;
      const loadedImages = [];

      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });
      };

      // 1. Discovery Phase
      while (consecutiveFailures < 2 && frameIndex < 300) {
        const paddedIndex = String(frameIndex).padStart(3, '0');
        const framePath = `/frames/frame_${paddedIndex}.jpg`;

        // We do a quick check to see if the file exists by trying to load it
        // Ideally, we would have a manifest, but this works for discovery
        const img = await loadImage(framePath);

        if (img) {
          discoveredPaths.push(framePath);
          loadedImages.push(img); // Keep the loaded image object
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
        }
        frameIndex++;
      }

      if (loadedImages.length > 0) {
        setImages(loadedImages);
      }
      setIsLoading(false);
    };

    discoverAndPreloadFrames();
  }, []);

  const currentFrameIndex = useMemo(() => {
    if (images.length === 0) return 0;
    const index = Math.floor(progress * (images.length - 1));
    return Math.min(Math.max(0, index), images.length - 1);
  }, [progress, images.length]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d');
    const img = images[currentFrameIndex];

    if (img) {
      // Set canvas size to match parent container
      // We rely on the ResizeObserver or just re-drawing on window resize could work,
      // but simplistic approach for now is to set internal resolution

      // Better approach for responsive canvas:
      // Keep internal resolution high or match image aspect ratio

      const draw = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;

          // Clear
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate aspect ratio fit (object-fit: contain)
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );

          const w = img.width * scale;
          const h = img.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;

          ctx.drawImage(img, x, y, w, h);
        }
      };

      // Initial draw
      draw();

      // Handle Resize - could use ResizeObserver for better perf, but window resize is okay for now
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }
  }, [currentFrameIndex, images]);

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

      {/* Canvas Display */}
      {!isLoading && images.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          <canvas
            ref={canvasRef}
            className="block w-full h-full"
          />
        </div>
      )}

      {/* Fallback if no frames found */}
      {!isLoading && images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#666' }}>
          <div className="text-center">
            <p>No frames found in /frames folder</p>
            <p className="text-sm mt-2">Add frame_000.jpg, frame_001.jpg, etc.</p>
          </div>
        </div>
      )}

      {/* Growth indicator */}
      {/* {!isLoading && images.length > 0 && (
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
            Frame {currentFrameIndex + 1} / {images.length}
          </p>
        </div>
      )} */}
    </div>
  );
}
