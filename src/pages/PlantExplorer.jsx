import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react';
import PlantCard from '../components/PlantCard';
import { plants, filterOptions } from '../data/plants';

export default function PlantExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    ayushSystem: [],
    category: [],
    region: [],
    partUsed: []
  });

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.medicinalProperties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

      // AYUSH System filter
      const ayushMatch = activeFilters.ayushSystem.length === 0 ||
        plant.ayushSystem.some(s => activeFilters.ayushSystem.includes(s));

      // Category filter
      const categoryMatch = activeFilters.category.length === 0 ||
        activeFilters.category.includes(plant.category);

      // Region filter
      const regionMatch = activeFilters.region.length === 0 ||
        activeFilters.region.includes(plant.region);

      // Part used filter
      const partMatch = activeFilters.partUsed.length === 0 ||
        plant.partUsed.some(p => activeFilters.partUsed.includes(p));

      return searchMatch && ayushMatch && categoryMatch && regionMatch && partMatch;
    });
  }, [searchQuery, activeFilters]);

  const toggleFilter = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      ayushSystem: [],
      category: [],
      region: [],
      partUsed: []
    });
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Plant <span className="text-gradient">Explorer</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover medicinal plants through interactive exploration. 
            Click on any plant to learn about its properties and uses.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search plants by name, property, or use..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-herb-500/50 transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-herb-500/10 border-herb-500/50 text-herb-400'
                  : 'bg-dark-600 border-herb-500/20 text-gray-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-herb-500 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-dark-600 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-herb-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Filter by</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-herb-400 text-sm hover:text-herb-300 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* AYUSH System */}
                    <div>
                      <h4 className="text-gray-400 text-sm mb-3">AYUSH System</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.ayushSystems.map(system => (
                          <button
                            key={system}
                            onClick={() => toggleFilter('ayushSystem', system)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              activeFilters.ayushSystem.includes(system)
                                ? 'bg-herb-500 text-white'
                                : 'bg-dark-500 text-gray-400 hover:text-white'
                            }`}
                          >
                            {system}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <h4 className="text-gray-400 text-sm mb-3">Category</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.categories.slice(0, 6).map(cat => (
                          <button
                            key={cat}
                            onClick={() => toggleFilter('category', cat)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              activeFilters.category.includes(cat)
                                ? 'bg-herb-500 text-white'
                                : 'bg-dark-500 text-gray-400 hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Region */}
                    <div>
                      <h4 className="text-gray-400 text-sm mb-3">Region</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.regions.slice(0, 4).map(region => (
                          <button
                            key={region}
                            onClick={() => toggleFilter('region', region)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              activeFilters.region.includes(region)
                                ? 'bg-herb-500 text-white'
                                : 'bg-dark-500 text-gray-400 hover:text-white'
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Part Used */}
                    <div>
                      <h4 className="text-gray-400 text-sm mb-3">Part Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.partsUsed.slice(0, 5).map(part => (
                          <button
                            key={part}
                            onClick={() => toggleFilter('partUsed', part)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              activeFilters.partUsed.includes(part)
                                ? 'bg-herb-500 text-white'
                                : 'bg-dark-500 text-gray-400 hover:text-white'
                            }`}
                          >
                            {part}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-herb-400 font-semibold">{filteredPlants.length}</span> of {plants.length} plants
          </p>
        </div>

        {/* Plants Grid/List */}
        {filteredPlants.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-4'
          }>
            {filteredPlants.map((plant, index) => (
              <PlantCard key={plant.id} plant={plant} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl text-white mb-2">No plants found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}
              className="btn-secondary"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
