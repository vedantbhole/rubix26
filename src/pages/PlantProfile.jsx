import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Bookmark, BookmarkCheck, Share2, 
  Leaf, MapPin, AlertTriangle, Heart, Sparkles,
  ChevronRight, ExternalLink, Edit3, Check
} from 'lucide-react';
import { plants, healthThemes } from '../data/plants';
import { useBookmarks } from '../hooks/useBookmarks';

export default function PlantProfile() {
  const { id } = useParams();
  const plant = plants.find(p => p.id === parseInt(id));
  const { isBookmarked, toggleBookmark, getNote, addNote } = useBookmarks();
  
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteText, setNoteText] = useState(plant ? getNote(plant.id) : '');
  const [activeTab, setActiveTab] = useState('overview');

  if (!plant) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Plant not found</h2>
          <Link to="/explorer" className="btn-primary">
            Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(plant.id);
  const relatedPlants = plants.filter(p => 
    p.id !== plant.id && 
    p.healthThemes.some(t => plant.healthThemes.includes(t))
  ).slice(0, 3);

  const plantThemes = healthThemes.filter(t => plant.healthThemes.includes(t.id));

  const handleSaveNote = () => {
    addNote(plant.id, noteText);
    setShowNoteEditor(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'uses', label: 'Therapeutic Uses' },
    { id: 'precautions', label: 'Precautions' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/explorer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-herb-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explorer
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            {/* Image */}
            <div className="glass-card overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleBookmark(plant.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      bookmarked
                        ? 'bg-herb-500 text-white'
                        : 'bg-dark-800/80 backdrop-blur text-gray-400 hover:text-herb-400'
                    }`}
                  >
                    {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-dark-800/80 backdrop-blur text-gray-400 hover:text-herb-400 flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className="font-display font-bold text-3xl text-white mb-2">{plant.name}</h1>
                <p className="text-herb-400 italic mb-4">{plant.botanicalName}</p>
                
                {/* Common Names */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plant.commonNames.map((name, i) => (
                    <span key={i} className="px-3 py-1 bg-dark-600 text-gray-300 text-sm rounded-lg">
                      {name}
                    </span>
                  ))}
                </div>

                {/* AYUSH Systems */}
                <div className="flex flex-wrap gap-2">
                  {plant.ayushSystem.map((system, i) => (
                    <span key={i} className="px-3 py-1 bg-herb-500/10 text-herb-400 text-sm rounded-lg border border-herb-500/30">
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="glass-card p-6 mb-6">
              <h3 className="font-display font-semibold text-white mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Region</p>
                    <p className="text-white">{plant.region}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Parts Used</p>
                    <p className="text-white">{plant.partUsed.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Category</p>
                    <p className="text-white">{plant.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Dosha Effect</p>
                    <p className="text-white">{plant.doshaEffect}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Notes */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">My Notes</h3>
                <button
                  onClick={() => setShowNoteEditor(!showNoteEditor)}
                  className="text-herb-400 hover:text-herb-300 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              
              {showNoteEditor ? (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your personal notes about this plant..."
                    className="w-full h-32 p-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-herb-500/50"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setShowNoteEditor(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-herb-500 text-white rounded-lg hover:bg-herb-400 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  {getNote(plant.id) || 'No notes yet. Click the edit icon to add notes.'}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Tabs */}
            <div className="glass-card mb-6">
              <div className="flex border-b border-herb-500/10">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-herb-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-herb-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-300 leading-relaxed mb-6">{plant.description}</p>
                    
                    <h4 className="font-display font-semibold text-white mb-4">Medicinal Properties</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {plant.medicinalProperties.map((prop, i) => (
                        <span key={i} className="px-4 py-2 bg-herb-500/10 text-herb-400 rounded-xl border border-herb-500/20">
                          {prop}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-display font-semibold text-white mb-4">Health Themes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {plantThemes.map(theme => (
                        <Link
                          key={theme.id}
                          to={`/tours?theme=${theme.id}`}
                          className="flex items-center gap-3 p-4 bg-dark-600 rounded-xl hover:bg-dark-500 transition-colors group"
                        >
                          <span className="text-2xl">{theme.icon}</span>
                          <div className="flex-1">
                            <p className="text-white font-medium group-hover:text-herb-400 transition-colors">{theme.name}</p>
                            <p className="text-gray-500 text-sm">{theme.plants.length} plants</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-herb-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'uses' && (
                  <div>
                    <h4 className="font-display font-semibold text-white mb-4">Therapeutic Uses</h4>
                    <ul className="space-y-3">
                      {plant.therapeuticUses.map((use, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 bg-herb-500 rounded-full" />
                          <span className="text-gray-300">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'precautions' && (
                  <div>
                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      <p className="text-yellow-400">Always consult a qualified practitioner before using medicinal plants.</p>
                    </div>
                    
                    <h4 className="font-display font-semibold text-white mb-4">Precautions & Contraindications</h4>
                    <ul className="space-y-3">
                      {plant.precautions.map((precaution, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <span className="text-gray-300">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Related Plants */}
            {relatedPlants.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-white mb-6">Related Plants</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPlants.map(relatedPlant => (
                    <Link
                      key={relatedPlant.id}
                      to={`/plant/${relatedPlant.id}`}
                      className="group"
                    >
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                        <img
                          src={relatedPlant.image}
                          alt={relatedPlant.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark-900/50 group-hover:bg-dark-900/30 transition-colors" />
                      </div>
                      <h4 className="text-white font-medium group-hover:text-herb-400 transition-colors">{relatedPlant.name}</h4>
                      <p className="text-gray-500 text-sm">{relatedPlant.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
