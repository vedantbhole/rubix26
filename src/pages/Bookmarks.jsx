import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkX, Trash2, Plus, Edit3, Check, X,
  FolderPlus, ChevronRight, Leaf, FileText, Download
} from 'lucide-react';
import { plants } from '../data/plants';
import { useBookmarks } from '../hooks/useBookmarks';

export default function Bookmarks() {
  const {
    bookmarks,
    toggleBookmark,
    studyLists,
    createStudyList,
    addToStudyList,
    removeFromStudyList,
    deleteStudyList,
    getNote
  } = useBookmarks();

  const [activeTab, setActiveTab] = useState('bookmarks');
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);

  const bookmarkedPlants = plants.filter(p => bookmarks.map(String).includes(String(p.id)));

  const handleCreateList = () => {
    if (newListName.trim()) {
      createStudyList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  const selectedList = studyLists.find(l => l.id === selectedListId);
  const selectedListPlants = selectedList
    ? selectedList.plants.map(id => plants.find(p => p.id === id)).filter(Boolean)
    : [];

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
            My <span className="text-gradient">Collection</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your bookmarked plants, personal notes, and custom study lists -
            all in one place for easy reference.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1 inline-flex">
            <button
              onClick={() => { setActiveTab('bookmarks'); setSelectedListId(null); }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'bookmarks'
                ? 'bg-herb-500 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                Bookmarks ({bookmarks.length})
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('lists'); setSelectedListId(null); }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'lists'
                ? 'bg-herb-500 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Study Lists ({studyLists.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {bookmarkedPlants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedPlants.map((plant, index) => (
                    <motion.div
                      key={plant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card overflow-hidden group"
                    >
                      <div className="relative h-48">
                        <img
                          src={plant.new_url || plant.image_url || plant.image}
                          alt={plant.common_name || plant.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />

                        {/* Remove Bookmark */}
                        <button
                          onClick={() => toggleBookmark(plant.id)}
                          className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <BookmarkX className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5">
                        <Link to={`/plant/${plant.id}`}>
                          <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-herb-400 transition-colors">
                            {plant.common_name || plant.name}
                          </h3>
                        </Link>
                        <p className="text-herb-500/70 text-sm italic mb-3">{plant.botanical_name || plant.botanicalName}</p>

                        {/* Note Preview */}
                        {getNote(plant.id) && (
                          <div className="p-3 bg-dark-600 rounded-lg mb-3">
                            <p className="text-gray-400 text-sm line-clamp-2">
                              📝 {getNote(plant.id)}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-herb-500/10 text-herb-400 text-xs rounded">
                              {plant.ayush_system || (Array.isArray(plant.ayushSystem) ? plant.ayushSystem[0] : plant.ayushSystem) || 'AYUSH'}
                            </span>
                          </div>
                          <Link
                            to={`/plant/${plant.id}`}
                            className="text-herb-400 hover:text-herb-300 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700 flex items-center justify-center">
                    <Bookmark className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl text-white mb-2">No bookmarks yet</h3>
                  <p className="text-gray-500 mb-6">Start exploring plants and bookmark your favorites</p>
                  <Link to="/explorer" className="btn-primary">
                    Explore Plants
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'lists' && !selectedListId && (
            <motion.div
              key="lists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Create New List Button */}
              <button
                onClick={() => setShowNewListModal(true)}
                className="w-full glass-card p-6 mb-6 flex items-center justify-center gap-3 text-gray-400 hover:text-herb-400 hover:border-herb-500/30 transition-all group"
              >
                <FolderPlus className="w-6 h-6" />
                <span className="font-medium">Create New Study List</span>
              </button>

              {studyLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyLists.map((list, index) => {
                    const listPlants = list.plants.map(id => plants.find(p => p.id === id)).filter(Boolean);
                    return (
                      <motion.div
                        key={list.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 group hover:border-herb-500/30 transition-all cursor-pointer"
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-display font-bold text-xl text-white group-hover:text-herb-400 transition-colors">
                            {list.name}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStudyList(list.id);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Plant Previews */}
                        <div className="flex -space-x-3 mb-4">
                          {listPlants.slice(0, 5).map(plant => (
                            <img
                              key={plant.id}
                              src={plant.new_url || plant.image_url || plant.image}
                              alt={plant.common_name || plant.name}
                              className="w-10 h-10 rounded-full border-2 border-dark-700 object-cover"
                            />
                          ))}
                          {listPlants.length === 0 && (
                            <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
                              <Leaf className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {list.plants.length} plants
                          </span>
                          <span className="text-gray-600">
                            {new Date(list.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl text-white mb-2">No study lists yet</h3>
                  <p className="text-gray-500 mb-6">Create a study list to organize plants for learning</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'lists' && selectedListId && selectedList && (
            <motion.div
              key="list-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedListId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-herb-400 transition-colors mb-6"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                Back to Lists
              </button>

              <div className="glass-card p-6 mb-8">
                <h2 className="font-display font-bold text-2xl text-white mb-2">{selectedList.name}</h2>
                <p className="text-gray-500">{selectedListPlants.length} plants in this list</p>
              </div>

              {/* Add from Bookmarks */}
              {bookmarkedPlants.filter(p => !selectedList.plants.includes(p.id)).length > 0 && (
                <div className="glass-card p-6 mb-8">
                  <h3 className="font-medium text-white mb-4">Add from Bookmarks</h3>
                  <div className="flex flex-wrap gap-3">
                    {bookmarkedPlants
                      .filter(p => !selectedList.plants.includes(p.id))
                      .map(plant => (
                        <button
                          key={plant.id}
                          onClick={() => addToStudyList(selectedList.id, plant.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-herb-400" />
                          <span className="text-gray-300">{plant.common_name || plant.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* List Plants */}
              {selectedListPlants.length > 0 ? (
                <div className="space-y-4">
                  {selectedListPlants.map((plant, index) => (
                    <motion.div
                      key={plant.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-4 flex items-center gap-4 group"
                    >
                      <img
                        src={plant.new_url || plant.image_url || plant.image}
                        alt={plant.common_name || plant.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/plant/${plant.id}`}
                          className="font-display font-semibold text-white hover:text-herb-400 transition-colors"
                        >
                          {plant.common_name || plant.name}
                        </Link>
                        <p className="text-gray-500 text-sm">{plant.botanical_name || plant.botanicalName}</p>
                      </div>
                      <button
                        onClick={() => removeFromStudyList(selectedList.id, plant.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No plants in this list yet. Add from your bookmarks above.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* New List Modal */}
        <AnimatePresence>
          {showNewListModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm"
              onClick={() => setShowNewListModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display font-bold text-2xl text-white mb-6">Create Study List</h3>
                <input
                  type="text"
                  placeholder="Enter list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                  className="w-full px-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-herb-500/50 mb-6"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowNewListModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateList}
                    disabled={!newListName.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create List
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
