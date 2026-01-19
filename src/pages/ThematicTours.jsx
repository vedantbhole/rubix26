import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, ChevronRight, ChevronLeft, Play, Pause, 
  RotateCcw, Leaf, ArrowRight, Check
} from 'lucide-react';
import { plants, healthThemes } from '../data/plants';

export default function ThematicTours() {
  const [searchParams] = useSearchParams();
  const initialTheme = searchParams.get('theme');
  
  const [selectedTour, setSelectedTour] = useState(
    initialTheme ? healthThemes.find(t => t.id === initialTheme) : null
  );
  const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedPlants, setCompletedPlants] = useState([]);

  const tourPlants = selectedTour 
    ? selectedTour.plants.map(id => plants.find(p => p.id === id)).filter(Boolean)
    : [];

  const currentPlant = tourPlants[currentPlantIndex];

  // Auto-advance when playing
  useEffect(() => {
    let interval;
    if (isPlaying && selectedTour) {
      interval = setInterval(() => {
        setCurrentPlantIndex(prev => {
          if (prev < tourPlants.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedTour, tourPlants.length]);

  const handleNext = () => {
    if (currentPlantIndex < tourPlants.length - 1) {
      setCompletedPlants(prev => [...prev, tourPlants[currentPlantIndex].id]);
      setCurrentPlantIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPlantIndex > 0) {
      setCurrentPlantIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentPlantIndex(0);
    setCompletedPlants([]);
    setIsPlaying(false);
  };

  const selectTour = (tour) => {
    setSelectedTour(tour);
    setCurrentPlantIndex(0);
    setCompletedPlants([]);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {!selectedTour ? (
          /* Tour Selection View */
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
                Guided <span className="text-gradient">Thematic Tours</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore medicinal plants organized by health themes. 
                Take a guided journey through nature's pharmacy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthThemes.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectTour(theme)}
                  className="glass-card p-8 text-left group hover:border-herb-500/40 transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{theme.icon}</div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-herb-400 transition-colors">
                    {theme.name}
                  </h2>
                  <p className="text-gray-400 mb-6">{theme.description}</p>
                  
                  {/* Plant previews */}
                  <div className="flex -space-x-3 mb-4">
                    {theme.plants.slice(0, 4).map(plantId => {
                      const plant = plants.find(p => p.id === plantId);
                      return plant ? (
                        <img
                          key={plantId}
                          src={plant.image}
                          alt={plant.name}
                          className="w-10 h-10 rounded-full border-2 border-dark-700 object-cover"
                        />
                      ) : null;
                    })}
                    {theme.plants.length > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-dark-700 bg-dark-600 flex items-center justify-center text-sm text-gray-400">
                        +{theme.plants.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-herb-500">{theme.plants.length} plants</span>
                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-herb-400 transition-colors">
                      Start Tour
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          /* Tour Player View */
          <>
            {/* Tour Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <button
                onClick={() => setSelectedTour(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-herb-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Tours
              </button>
              <div className="flex items-center gap-2">
                <span className="text-4xl">{selectedTour.icon}</span>
                <h2 className="font-display font-bold text-2xl text-white">{selectedTour.name}</h2>
              </div>
              <div className="text-gray-400">
                {currentPlantIndex + 1} / {tourPlants.length}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex gap-2">
                {tourPlants.map((plant, index) => (
                  <button
                    key={plant.id}
                    onClick={() => setCurrentPlantIndex(index)}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index < currentPlantIndex
                        ? 'bg-herb-500'
                        : index === currentPlantIndex
                        ? 'bg-herb-400 animate-pulse'
                        : 'bg-dark-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Plant Display */}
            <AnimatePresence mode="wait">
              {currentPlant && (
                <motion.div
                  key={currentPlant.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Plant Image */}
                  <div className="glass-card overflow-hidden">
                    <div className="relative h-80 lg:h-[500px]">
                      <img
                        src={currentPlant.image}
                        alt={currentPlant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {currentPlant.ayushSystem.map((sys, i) => (
                            <span key={i} className="px-3 py-1 bg-herb-500/20 backdrop-blur text-herb-400 text-sm rounded-full">
                              {sys}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-1">{currentPlant.name}</h3>
                        <p className="text-herb-400 italic">{currentPlant.botanicalName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plant Info */}
                  <div className="glass-card p-8">
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{currentPlant.description}</p>
                    
                    <h4 className="font-display font-semibold text-white mb-3">Key Benefits</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentPlant.medicinalProperties.map((prop, i) => (
                        <span key={i} className="px-3 py-1.5 bg-herb-500/10 text-herb-400 rounded-lg border border-herb-500/20">
                          {prop}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-display font-semibold text-white mb-3">Therapeutic Uses</h4>
                    <ul className="space-y-2 mb-6">
                      {currentPlant.therapeuticUses.slice(0, 4).map((use, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400">
                          <Check className="w-5 h-5 text-herb-500 mt-0.5" />
                          {use}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/plant/${currentPlant.id}`}
                      className="inline-flex items-center gap-2 text-herb-400 hover:text-herb-300 transition-colors"
                    >
                      View Full Profile
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tour Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <button
                onClick={handlePrev}
                disabled={currentPlantIndex === 0}
                className="p-4 rounded-full bg-dark-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-500 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full bg-herb-500 text-white hover:bg-herb-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-4 rounded-full bg-dark-600 text-white hover:bg-dark-500 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentPlantIndex === tourPlants.length - 1}
                className="p-4 rounded-full bg-dark-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-500 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Tour Completion */}
            {currentPlantIndex === tourPlants.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-herb-500/10 border border-herb-500/30 rounded-full text-herb-400 mb-4">
                  <Check className="w-5 h-5" />
                  Tour Complete!
                </div>
                <p className="text-gray-400 mb-6">
                  You've explored all {tourPlants.length} plants in this tour.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="btn-secondary"
                  >
                    Restart Tour
                  </button>
                  <button
                    onClick={() => setSelectedTour(null)}
                    className="btn-primary"
                  >
                    Choose Another Tour
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
