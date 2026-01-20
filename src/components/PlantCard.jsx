import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import PlantModelModal from './PlantModelModal';

// Lazy load the 3D preview for performance
const PlantModelPreview = lazy(() => import('./PlantModelPreview'));

// Map of plant IDs to their 3D model paths
const plantModels = {
  1: '/models/tulsi.glb',        // Tulsi
  2: '/models/ashwagandha.glb',  // Ashwagandha
  3: '/models/neem.glb',
  4: '/models/basil.glb',
  5: '/models/lavender.glb',
  6: '/models/aloevera.glb',
  8: '/models/brahmi.glb',
  9: '/models/amla.glb',
  10: '/models/giloy.glb',
};

export default function PlantCard({ plant, index = 0 }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(plant.id);
  const [showModelModal, setShowModelModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if this plant has a 3D model
  const has3DModel = plantModels[plant.id];

  const handleEyeClick = (e) => {
    e.preventDefault();
    if (has3DModel) {
      setShowModelModal(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="plant-card group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-dark-700">
          {/* Static image - hidden when hovering on plants with 3D models */}
          <img
            src={plant.image}
            alt={plant.name}
            className={`w-full h-full object-cover transition-all duration-500 ${has3DModel && isHovered
              ? 'opacity-0 scale-110'
              : 'opacity-100 group-hover:scale-110'
              }`}
          />

          {/* 3D Model Preview - shown on hover for plants with models */}
          {has3DModel && isHovered && (
            <Suspense fallback={null}>
              <PlantModelPreview
                modelPath={plantModels[plant.id]}
                isHovered={isHovered}
              />
            </Suspense>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* 3D indicator badge */}
          {has3DModel && (
            <div className={`absolute bottom-4 left-4 px-2 py-1 text-xs font-medium bg-herb-500/20 backdrop-blur-sm text-herb-400 rounded-lg border border-herb-500/30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              3D Model
            </div>
          )}

          {/* AYUSH Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {plant.ayushSystem.slice(0, 2).map((system, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-dark-800/80 backdrop-blur-sm text-herb-400 rounded-full border border-herb-500/30"
              >
                {system}
              </span>
            ))}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(plant.id);
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 z-10 ${bookmarked
              ? 'bg-herb-500 text-white'
              : 'bg-dark-800/80 backdrop-blur-sm text-gray-400 hover:text-herb-400 border border-herb-500/30'
              }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>

          {/* Quick View Button - Opens modal for plants with 3D models */}
          {has3DModel ? (
            <button
              onClick={handleEyeClick}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-herb-500/90 text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
              title="View 3D Model"
            >
              <Eye className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to={`/plant/${plant.id}`}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-herb-500/90 text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
            >
              <Eye className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <Link to={`/plant/${plant.id}`}>
            <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-herb-400 transition-colors">
              {plant.name}
            </h3>
          </Link>
          <p className="text-herb-500/80 text-sm italic mb-3">{plant.botanicalName}</p>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {plant.description}
          </p>

          {/* Properties Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {plant.medicinalProperties.slice(0, 3).map((prop, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-dark-600 text-gray-300 rounded-lg"
              >
                {prop}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-herb-500/10">
            <span className="text-sm text-gray-500">
              {plant.partUsed.slice(0, 2).join(' • ')}
            </span>
            <Link
              to={`/plant/${plant.id}`}
              className="flex items-center gap-1 text-herb-400 text-sm font-medium hover:gap-2 transition-all duration-300"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 3D Model Modal */}
      {has3DModel && (
        <PlantModelModal
          isOpen={showModelModal}
          onClose={() => setShowModelModal(false)}
          plantName={plant.name}
          modelPath={plantModels[plant.id]}
        />
      )}
    </>
  );
}
