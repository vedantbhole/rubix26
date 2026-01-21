import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, Table, Grid,
  ArrowUpDown, ChevronRight, Eye, Bookmark,
  ExternalLink, Leaf, BookOpen, Loader2,
  ChevronLeft
} from 'lucide-react';
import { filterOptions } from '../data/plants'; // Keep static options for now or fetch them
import { useBookmarks } from '../hooks/useBookmarks';
import { usePlants } from '../hooks/usePlants';
import { useAyushSearch, AYUSH_SYSTEMS } from '../hooks/useAyushSearch';

export default function Compendium() {
  const { plants, loading, pagination, fetchPlants, goToPage, nextPage, prevPage } = usePlants();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // AYUSH search state
  const [searchMode, setSearchMode] = useState('local'); // 'local' | 'ayush'
  const [ayushSystem, setAyushSystem] = useState('ayurveda'); // Current AYUSH system
  const [ayushSearchType, setAyushSearchType] = useState('botanical'); // 'botanical' | 'vernacular'
  const [ayushQuery, setAyushQuery] = useState('');

  const {
    loading: ayushLoading,
    error: ayushError,
    results: ayushResults,
    totalCount: ayushTotalCount,
    searchVernacular,
    searchBotanical,
    clearResults,
  } = useAyushSearch();

  // Handle AYUSH search
  const handleAyushSearch = useCallback(() => {
    if (!ayushQuery.trim()) return;

    if (ayushSearchType === 'botanical') {
      searchBotanical(ayushSystem, ayushQuery);
    } else {
      searchVernacular(ayushSystem, ayushQuery);
    }
  }, [ayushQuery, ayushSearchType, ayushSystem, searchBotanical, searchVernacular]);

  // Handle Enter key for AYUSH search
  const handleAyushKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAyushSearch();
    }
  }, [handleAyushSearch]);

  // Debounced search effect for server-side filtering
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchMode === 'local') {
        fetchPlants({
          page: 1,
          search: searchQuery,
          ayush_system: selectedSystem
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSystem, searchMode, fetchPlants]);

  // Plants are now fetched from server with pagination, just sort locally
  const sortedPlants = useMemo(() => {
    if (loading) return [];
    let result = [...plants];

    // Sort locally (server-side sorting can be added later)
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.common_name || a.name || '').localeCompare(b.common_name || b.name || '');
          break;
        case 'botanical':
          comparison = (a.botanical_name || '').localeCompare(b.botanical_name || '');
          break;
        case 'category':
          comparison = (a.disease_category?.[0] || '').localeCompare(b.disease_category?.[0] || '');
          break;
        case 'region':
          comparison = (a.region || '').localeCompare(b.region || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [sortBy, sortOrder, plants, loading]);

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
      className={`flex items-center gap-2 transition-colors ${sortBy === field ? 'text-herb-400' : 'text-gray-400 hover:text-white'
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

        {/* Search Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="flex bg-dark-600 rounded-xl p-1">
            <button
              onClick={() => {
                setSearchMode('local');
                clearResults();
              }}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${searchMode === 'local' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              <Leaf className="w-4 h-4" />
              Our Database
            </button>
            <button
              onClick={() => setSearchMode('ayush')}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${searchMode === 'ayush' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              AYUSH Search
            </button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-8"
        >
          {searchMode === 'local' ? (
            /* Local Database Controls */
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
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'table' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Table className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'grid' ? 'bg-herb-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                  Cards
                </button>
              </div>
            </div>
          ) : (
            /* AYUSH Search Controls */
            <div className="space-y-4">
              {/* AYUSH System Selector */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-400">Medical System:</span>
                <select
                  value={ayushSystem}
                  onChange={(e) => {
                    setAyushSystem(e.target.value);
                    clearResults();
                  }}
                  className="px-4 py-2 bg-dark-600 border border-herb-500/20 rounded-xl text-white focus:outline-none focus:border-herb-500/50 transition-colors cursor-pointer"
                >
                  {AYUSH_SYSTEMS.map(system => (
                    <option key={system.id} value={system.id}>{system.name}</option>
                  ))}
                </select>
              </div>

              {/* Search Type Toggle */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-400">Search by:</span>
                <div className="flex bg-dark-600 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setAyushSearchType('botanical');
                      clearResults();
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${ayushSearchType === 'botanical'
                      ? 'bg-herb-500 text-white'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Botanical Names
                  </button>
                  <button
                    onClick={() => {
                      setAyushSearchType('vernacular');
                      clearResults();
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${ayushSearchType === 'vernacular'
                      ? 'bg-herb-500 text-white'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Vernacular Names
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={
                      ayushSearchType === 'botanical'
                        ? "Search botanical name (e.g., Aloe, Ocimum)..."
                        : "Search vernacular name (e.g., Tulsi, Neem)..."
                    }
                    value={ayushQuery}
                    onChange={(e) => setAyushQuery(e.target.value)}
                    onKeyDown={handleAyushKeyDown}
                    className="w-full pl-12 pr-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-herb-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={handleAyushSearch}
                  disabled={ayushLoading || !ayushQuery.trim()}
                  className="px-6 py-3 bg-herb-500 hover:bg-herb-600 disabled:bg-herb-500/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  {ayushLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Search
                </button>
              </div>

              {/* Info text */}
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Results from{' '}
                <a
                  href="https://www.medicinalplants.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-herb-400 hover:underline"
                >
                  medicinalplants.in
                </a>
                {' '}({AYUSH_SYSTEMS.find(s => s.id === ayushSystem)?.name || 'AYUSH'} database)
              </p>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          {searchMode === 'local' ? (
            <p className="text-gray-400">
              Found <span className="text-herb-400 font-semibold">{pagination.total}</span> plants
            </p>
          ) : (
            <p className="text-gray-400">
              {ayushResults.length > 0 && (
                <>Found <span className="text-herb-400 font-semibold">{ayushTotalCount}</span> results</>
              )}
            </p>
          )}
        </div>

        {/* Content based on search mode */}
        {searchMode === 'local' ? (
          <>
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
                      {sortedPlants.map((plant, index) => (
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
                                src={plant.image_url || plant.new_url || '/placeholder-plant.jpg'}
                                alt={plant.common_name || plant.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-white font-medium">{plant.common_name || plant.name}</p>
                                <p className="text-gray-500 text-sm md:hidden">{plant.botanical_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-herb-400 italic hidden md:table-cell">
                            {plant.botanical_name}
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="px-3 py-1 bg-dark-600 text-gray-300 text-sm rounded-lg">
                              {plant.disease_category?.[0] || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {plant.ayush_system ? (
                                <span className="px-2 py-0.5 bg-herb-500/10 text-herb-400 text-xs rounded">
                                  {plant.ayush_system}
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 hidden xl:table-cell">
                            {plant.region || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleBookmark(plant._id || plant.id)}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked(plant._id || plant.id)
                                  ? 'text-herb-400 bg-herb-500/10'
                                  : 'text-gray-500 hover:text-herb-400'
                                  }`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                              <Link
                                to={`/plant/${plant._id || plant.id}`}
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
                {sortedPlants.map((plant, index) => (
                  <motion.div
                    key={plant._id || plant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/plant/${plant._id || plant.id}`}
                      className="block glass-card overflow-hidden group hover:border-herb-500/30 transition-all duration-300"
                    >
                      <div className="relative h-40">
                        <img
                          src={plant.image_url || plant.new_url || '/placeholder-plant.jpg'}
                          alt={plant.common_name || plant.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(plant._id || plant.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${isBookmarked(plant._id || plant.id)
                            ? 'bg-herb-500 text-white'
                            : 'bg-dark-800/80 text-gray-400 hover:text-herb-400'
                            }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold group-hover:text-herb-400 transition-colors">{plant.common_name || plant.name}</h3>
                        <p className="text-herb-500/70 text-sm italic mb-2">{plant.botanical_name}</p>
                        <div className="flex flex-wrap gap-1">
                          {plant.ayush_system && (
                            <span className="px-2 py-0.5 bg-herb-500/10 text-herb-400 text-xs rounded">
                              {plant.ayush_system}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State for Local */}
            {sortedPlants.length === 0 && !loading && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No plants found</h3>
                <p className="text-gray-500">Try a different search term or filter</p>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 text-herb-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading plants...</p>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={prevPage}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg bg-dark-600 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <div className="flex gap-1">
                  {/* First page */}
                  {pagination.page > 3 && (
                    <>
                      <button
                        onClick={() => goToPage(1)}
                        className="w-10 h-10 rounded-lg bg-dark-600 text-gray-400 hover:text-white transition-colors"
                      >
                        1
                      </button>
                      {pagination.page > 4 && <span className="px-2 text-gray-500">...</span>}
                    </>
                  )}

                  {/* Page numbers around current */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${pagination.page === pageNum
                            ? 'bg-herb-500 text-white'
                            : 'bg-dark-600 text-gray-400 hover:text-white'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Last page */}
                  {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => goToPage(pagination.totalPages)}
                        className="w-10 h-10 rounded-lg bg-dark-600 text-gray-400 hover:text-white transition-colors"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-dark-600 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Page info */}
            {pagination.total > 0 && !loading && (
              <p className="text-center text-gray-500 text-sm mt-4">
                Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} plants
              </p>
            )}
          </>
        ) : (
          /* AYUSH Search Results */
          <div>
            {/* Error State */}
            {ayushError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 text-center border-red-500/30"
              >
                <p className="text-red-400">{ayushError}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please check your connection or try again later.
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {ayushLoading && (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 text-herb-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Searching {AYUSH_SYSTEMS.find(s => s.id === ayushSystem)?.name || 'AYUSH'} database...</p>
              </div>
            )}

            {/* Results */}
            {!ayushLoading && ayushResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {ayushResults.map((result, index) => (
                  <motion.a
                    key={index}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block glass-card p-5 hover:border-herb-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-herb-400 font-semibold text-lg italic group-hover:text-herb-300 transition-colors">
                          {result.botanicalName}
                        </h3>
                        {result.vernacularNames && (
                          <p
                            className="text-gray-400 text-sm mt-2"
                            dangerouslySetInnerHTML={{
                              __html: result.vernacularNames
                                .replace(/<b><span class='myhighlight'>/g, '<span class="text-herb-400 font-medium">')
                                .replace(/<\/span><\/b>/g, '</span>')
                            }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-herb-400 transition-colors">
                        <span className="text-sm hidden sm:inline">View on medicinalplants.in</span>
                        <ExternalLink className="w-5 h-5 flex-shrink-0" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Empty/Initial State for AYUSH */}
            {!ayushLoading && ayushResults.length === 0 && !ayushError && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Search the {AYUSH_SYSTEMS.find(s => s.id === ayushSystem)?.name || 'AYUSH'} Database</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter a {ayushSearchType === 'botanical' ? 'botanical' : 'vernacular'} name to search
                  the comprehensive {AYUSH_SYSTEMS.find(s => s.id === ayushSystem)?.name || 'AYUSH'} medicinal plants database from medicinalplants.in
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
