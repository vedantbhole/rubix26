import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Loader2,
  MapPin,
  Leaf,
  Activity,
  Eye
} from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import PlantModelModal from './PlantModelModal';

const PlantModelPreview = lazy(() => import('./PlantModelPreview'));

export const plantModels = {
  1: '/models/tulsi.glb',
  2: '/models/ashwagandha.glb',
  3: '/models/neem.glb',
  4: '/models/basil.glb',
  5: '/models/lavender.glb',
  6: '/models/aloevera.glb',
  8: '/models/brahmi.glb',
  9: '/models/amla.glb',
  10: '/models/giloy.glb',
};

export default function PlantCard({ plant, index = 0 }) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Get the numeric ID for 3D models and navigation
  // Backend returns jsonId (numeric), local data has id (numeric)
  const numericId = plant.jsonId ?? plant.id;

  // Check if bookmarked using numeric ID
  const bookmarked = isBookmarked(numericId);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);

  const imgRef = useRef(null);

  const has3DModel = Boolean(plantModels[numericId]);

  // ---------- Normalize data ----------
  const plantName = plant.common_name || plant.name || 'Unnamed Plant';
  const botanicalName = plant.botanical_name || plant.botanicalName || '';
  const imageUrl = plant.new_url || plant.image || null;
  const region = plant.region || '';
  const partUsed =
    plant.part_used ||
    (Array.isArray(plant.partUsed) ? plant.partUsed.join(', ') : plant.partUsed) ||
    '';

  const ayushSystem =
    plant.ayush_system ||
    (Array.isArray(plant.ayushSystem) ? plant.ayushSystem[0] : plant.ayushSystem) ||
    '';

  const diseaseList = Array.isArray(plant.disease_category)
    ? plant.disease_category
    : plant.disease_category
      ? [plant.disease_category]
      : [];

  const usesList = Array.isArray(plant.therapeutic_uses)
    ? plant.therapeutic_uses
    : plant.therapeutic_uses
      ? [plant.therapeutic_uses]
      : [];

  const propsList = Array.isArray(plant.medicinal_properties)
    ? plant.medicinal_properties
    : plant.medicinal_properties
      ? [plant.medicinal_properties]
      : [];

  // ---------- IMAGE STATE FIX ----------
  useEffect(() => {
    if (!imageUrl) {
      // No image → mark as loaded immediately
      setImageLoaded(true);
      setImageError(true);
      return;
    }

    // Reset states for new image
    setImageLoaded(false);
    setImageError(false);

    // For plants without 3D models, programmatically preload the image
    // This ensures loading works properly during client-side navigation
    if (!has3DModel) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        setImageError(true);
        setImageLoaded(true);
      };
      img.src = imageUrl;

      // If the image is already cached, it might load synchronously
      if (img.complete) {
        setImageLoaded(true);
      }
    }
  }, [numericId, imageUrl, has3DModel]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleCardClick = () => navigate(`/plant/${numericId}`);
  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/plant/${numericId}`);
  };
  const handleEyeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (has3DModel) setShowModelModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="plant-card group cursor-pointer"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGE SECTION */}
        <div className="relative h-48 overflow-hidden bg-dark-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-herb-500 animate-spin" />
            </div>
          )}

          {/* Show image only when NOT hovering on a 3D model card */}
          {imageUrl && !imageError && !(has3DModel && isHovered) && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt={plantName}
              loading={has3DModel ? 'lazy' : 'eager'}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
                }`}
            />
          )}

          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl">🌿</span>
              <span className="text-xs mt-1">{plantName}</span>
            </div>
          )}

          {has3DModel && isHovered && (
            <Suspense fallback={null}>
              <PlantModelPreview modelPath={plantModels[numericId]} isHovered />
            </Suspense>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs bg-herb-500 text-white rounded-full">
              {ayushSystem}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(numericId);
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${bookmarked
              ? 'bg-herb-500 text-white'
              : 'bg-dark-800 text-gray-400'
              }`}
          >
            {bookmarked ? <BookmarkCheck /> : <Bookmark />}
          </button>
          {has3DModel && (
            <button
              onClick={handleEyeClick}
              className="absolute bottom-4 right-4 w-10 h-10 bg-herb-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <Eye />
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-white">{plantName}</h3>
          <p className="text-sm italic text-gray-400">{botanicalName}</p>

          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {region}
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3" /> {partUsed}
            </span>
          </div>

          <div className="flex justify-end mt-4 pt-3 border-t border-gray-700">
            <button
              onClick={handleLearnMoreClick}
              className="text-herb-400 flex items-center gap-1"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {has3DModel && (
        <PlantModelModal
          isOpen={showModelModal}
          onClose={() => setShowModelModal(false)}
          plantName={plantName}
          modelPath={plantModels[numericId]}
        />
      )}
    </>
  );
}
