import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import PlantCard from '../components/PlantCard';
import { plants } from '../data/plants';

const ITEMS_PER_PAGE = 6;

// Utility: extract unique values safely
const getUniqueValues = (arr, key) => {
  const set = new Set();
  arr.forEach(item => {
    const value = item[key];
    if (Array.isArray(value)) {
      value.forEach(v => set.add(v));
    } else if (value) {
      set.add(value);
    }
  });
  return Array.from(set).sort();
};

export default function PlantExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeFilters, setActiveFilters] = useState({
    ayushSystem: [],
    diseaseCategory: [],
    region: [],
    partUsed: []
  });

  // Build filter options directly from real data
  const filterOptions = useMemo(() => ({
    ayushSystems: getUniqueValues(plants, 'ayush_system'),
    diseaseCategories: getUniqueValues(plants, 'disease_category'),
    regions: getUniqueValues(plants, 'region'),
    partsUsed: getUniqueValues(plants, 'part_used')
  }), []);

  // Main filtering logic
  const filteredPlants = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return plants.filter(plant => {
      const name =
        plant.common_name?.toLowerCase() || '';
      const botanical =
        plant.botanical_name?.toLowerCase() || '';

      const ayush = Array.isArray(plant.ayush_system)
        ? plant.ayush_system
        : [plant.ayush_system];

      const diseaseCategories = Array.isArray(plant.disease_category)
        ? plant.disease_category
        : [];

      const partUsed = Array.isArray(plant.part_used)
        ? plant.part_used
        : [plant.part_used];

      const medicinalProps = plant.medicinal_properties || [];
      const therapeuticUses = plant.therapeutic_uses || [];

      // ---------- SEARCH ----------
      const searchMatch =
        !q ||
        name.includes(q) ||
        botanical.includes(q) ||
        ayush.some(a => a.toLowerCase().includes(q)) ||
        plant.region?.toLowerCase().includes(q) ||
        diseaseCategories.some(d => d.toLowerCase().includes(q)) ||
        medicinalProps.some(m => m.toLowerCase().includes(q)) ||
        therapeuticUses.some(t => t.toLowerCase().includes(q));

      // ---------- FILTERS ----------
      const ayushMatch =
        activeFilters.ayushSystem.length === 0 ||
        ayush.some(a => activeFilters.ayushSystem.includes(a));

      const diseaseMatch =
        activeFilters.diseaseCategory.length === 0 ||
        diseaseCategories.some(d =>
          activeFilters.diseaseCategory.includes(d)
        );

      // IMPORTANT FIX: substring match for region
      const regionMatch =
        activeFilters.region.length === 0 ||
        activeFilters.region.some(r =>
          plant.region?.toLowerCase().includes(r.toLowerCase())
        );

      const partMatch =
        activeFilters.partUsed.length === 0 ||
        partUsed.some(p => activeFilters.partUsed.includes(p));

      return (
        searchMatch &&
        ayushMatch &&
        diseaseMatch &&
        regionMatch &&
        partMatch
      );
    });
  }, [searchQuery, activeFilters]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
    console.log(currentPlants)
  }, [totalPages, currentPage]);

  const currentPlants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlants.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlants, currentPage]);

  const toggleFilter = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({
      ayushSystem: [],
      diseaseCategory: [],
      region: [],
      partUsed: []
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  const goToPage = useCallback(page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }, [totalPages]);

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

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
            Explore {plants.length} medicinal plants across AYUSH systems.
          </p>
        </motion.div>

        {/* Search + Controls */}
        <div className="glass-card p-4 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by plant, disease, use..."
              className="w-full pl-12 pr-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-600 border border-herb-500/20"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-herb-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex bg-dark-600 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-herb-500 text-white' : 'text-gray-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-herb-500 text-white' : 'text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <p className="text-gray-400 mb-6">
          Showing <span className="text-herb-400">{currentPlants.length}</span> of{' '}
          <span className="text-herb-400">{filteredPlants.length}</span> plants
        </p>

        {currentPlants.length > 0 ? (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-4'}
            >
            
              {currentPlants.map((plant, index) => (
                <PlantCard key={plant.common_name + index} plant={plant} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button onClick={() => goToPage(1)}><ChevronsLeft /></button>
                <button onClick={() => goToPage(currentPage - 1)}><ChevronLeft /></button>

                {getVisiblePages().map((p, i) =>
                  p === '...'
                    ? <span key={i}>…</span>
                    : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={p === currentPage ? 'text-herb-400' : ''}
                      >
                        {p}
                      </button>
                    )
                )}

                <button onClick={() => goToPage(currentPage + 1)}><ChevronRight /></button>
                <button onClick={() => goToPage(totalPages)}><ChevronsRight /></button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl text-white mb-2">No plants found</h3>
            <button onClick={clearFilters} className="btn-secondary">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
