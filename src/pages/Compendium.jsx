import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, Table, Grid, 
  ArrowUpDown, ChevronRight, Eye, Bookmark
} from 'lucide-react';
import { plants, filterOptions, ayushSystems } from '../data/plants';
import { useBookmarks } from '../hooks/useBookmarks';

export default function Compendium() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const filteredAndSortedPlants = useMemo(() => {
    let result = [...plants];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.botanicalName.toLowerCase().includes(query) ||
        plant.medicinalProperties.some(p => p.toLowerCase().includes(query)) ||
        plant.therapeuticUses.some(u => u.toLowerCase().includes(query))
      );
    }

    // Filter by AYUSH system
    if (selectedSystem !== 'all') {
      result = result.filter(plant =>
        plant.ayushSystem.includes(selectedSystem)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'botanical':
          comparison = a.botanicalName.localeCompare(b.botanicalName);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, selectedSystem, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-2 transition-colors ${
        sortBy === field ? 'text-herb-400' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

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
            Digital <span className="text-gradient">Compendium</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive searchable database of medicinal plants. 
            Search, sort, and filter to find exactly what you need.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, property, or therapeutic use..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-herb-500/50 transition-colors"
              />
            </div>

            {/* AYUSH System Filter */}
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="px-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white focus:outline-none focus:border-herb-500/50 transition-colors cursor-pointer"
            >
              <option value="all">All Systems</option>
              {filterOptions.ayushSystems.map(system => (
                <option key={system} value={system}>{system}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-dark-600 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  viewMode === 'table' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Table className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  viewMode === 'grid' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                Cards
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Found <span className="text-herb-400 font-semibold">{filteredAndSortedPlants.length}</span> plants
          </p>
        </div>

        {/* Table View */}
        {viewMode === 'table' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-herb-500/10">
                    <th className="px-6 py-4 text-left">
                      <SortButton field="name" label="Name" />
                    </th>
                    <th className="px-6 py-4 text-left hidden md:table-cell">
                      <SortButton field="botanical" label="Botanical Name" />
                    </th>
                    <th className="px-6 py-4 text-left hidden lg:table-cell">
                      <SortButton field="category" label="Category" />
                    </th>
                    <th className="px-6 py-4 text-left hidden lg:table-cell">Systems</th>
                    <th className="px-6 py-4 text-left hidden xl:table-cell">
                      <SortButton field="region" label="Region" />
                    </th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedPlants.map((plant, index) => (
                    <motion.tr
                      key={plant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-herb-500/5 hover:bg-herb-500/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white font-medium">{plant.name}</p>
                            <p className="text-gray-500 text-sm md:hidden">{plant.botanicalName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-herb-400 italic hidden md:table-cell">
                        {plant.botanicalName}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="px-3 py-1 bg-dark-600 text-gray-300 text-sm rounded-lg">
                          {plant.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {plant.ayushSystem.map((sys, i) => (
                            <span key={i} className="px-2 py-0.5 bg-herb-500/10 text-herb-400 text-xs rounded">
                              {sys}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 hidden xl:table-cell">
                        {plant.region}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleBookmark(plant.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isBookmarked(plant.id)
                                ? 'text-herb-400 bg-herb-500/10'
                                : 'text-gray-500 hover:text-herb-400'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/plant/${plant.id}`}
                            className="p-2 rounded-lg text-gray-500 hover:text-herb-400 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/plant/${plant.id}`}
                  className="block glass-card overflow-hidden group hover:border-herb-500/30 transition-all duration-300"
                >
                  <div className="relative h-40">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(plant.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                        isBookmarked(plant.id)
                          ? 'bg-herb-500 text-white'
                          : 'bg-dark-800/80 text-gray-400 hover:text-herb-400'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold group-hover:text-herb-400 transition-colors">{plant.name}</h3>
                    <p className="text-herb-500/70 text-sm italic mb-2">{plant.botanicalName}</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.ayushSystem.slice(0, 2).map((sys, i) => (
                        <span key={i} className="px-2 py-0.5 bg-herb-500/10 text-herb-400 text-xs rounded">
                          {sys}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedPlants.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No plants found</h3>
            <p className="text-gray-500">Try a different search term or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
