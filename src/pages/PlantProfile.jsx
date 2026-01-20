import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2,
  Leaf, MapPin, AlertTriangle, Sparkles, Heart, Loader2,
  Play, Pause, Volume2
} from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

export default function PlantProfile() {
  const { id } = useParams();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio state
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Fetch plant data from API
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5001/api/plants/${id}`);
        const data = await response.json();

        if (data.success && data.data) {
          setPlant(data.data);

          // Fetch related plants based on disease category
          const allPlantsRes = await fetch('http://localhost:5001/api/plants');
          const allPlantsData = await allPlantsRes.json();

          if (allPlantsData.success) {
            const diseaseCategories = data.data.disease_category || [];
            const related = allPlantsData.data
              .filter(p => {
                const plantId = p.jsonId ?? p.id;
                if (plantId === parseInt(id)) return false;
                const pCategories = p.disease_category || [];
                return diseaseCategories.some(d => pCategories.includes(d));
              })
              .slice(0, 3);
            setRelatedPlants(related);
          }
        } else {
          setError('Plant not found');
        }
      } catch (err) {
        console.error('Error fetching plant:', err);
        setError('Failed to load plant data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlant();
    }
  }, [id]);

  // Handle audio playback
  const handlePlayAudio = async () => {
    // If already have audio, toggle play/pause
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
      return;
    }

    // Fetch/generate audio
    try {
      setAudioLoading(true);
      const plantName = plant.common_name || plant.name || '';

      const response = await fetch(`http://localhost:5001/api/generate/audio/${encodeURIComponent(plantName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveToAppwrite: true })
      });

      const data = await response.json();

      if (data.success) {
        let audioSrc;

        if (data.data.fileId) {
          // Use the backend proxy to serve audio from Appwrite (avoids 401 auth issues)
          audioSrc = `http://localhost:5001/api/generate/audio/file/${data.data.fileId}`;
        } else if (data.data.base64) {
          // Use base64 data
          audioSrc = `data:audio/mpeg;base64,${data.data.base64}`;
        }

        if (audioSrc) {
          setAudioUrl(audioSrc);
          const audio = new Audio(audioSrc);

          audio.addEventListener('ended', () => {
            setIsPlaying(false);
          });

          audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            setIsPlaying(false);
          });

          setAudioElement(audio);
          audio.play();
          setIsPlaying(true);
        }
      } else {
        console.error('Failed to generate audio:', data.message);
      }
    } catch (err) {
      console.error('Error generating audio:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-herb-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">{error || 'Plant not found'}</h2>
          <Link to="/explorer" className="btn-primary">Back to Explorer</Link>
        </div>
      </div>
    );
  }

  // Get numeric ID for bookmarking
  const numericId = plant.jsonId ?? plant.id ?? parseInt(id);
  const bookmarked = isBookmarked(numericId);

  // Normalize field names to support both old and new data formats
  const plantName = plant.common_name || plant.name || '';
  const botanicalName = plant.botanical_name || plant.botanicalName || '';
  const imageUrl = plant.new_url || plant.image || '';
  const region = plant.region || '';
  const partUsed = plant.part_used || (Array.isArray(plant.partUsed) ? plant.partUsed.join(', ') : plant.partUsed) || '';

  // AYUSH system - handle both string and array formats
  const ayushSystem = plant.ayush_system || (Array.isArray(plant.ayushSystem) ? plant.ayushSystem.join(', ') : plant.ayushSystem) || '';

  // Disease/Category - handle both formats
  const diseaseCategories = plant.disease_category || (plant.category ? [plant.category] : []);
  const diseaseList = Array.isArray(diseaseCategories) ? diseaseCategories : [diseaseCategories].filter(Boolean);

  // Therapeutic uses
  const therapeuticUses = plant.therapeutic_uses || plant.therapeuticUses || [];
  const usesList = Array.isArray(therapeuticUses) ? therapeuticUses : [therapeuticUses].filter(Boolean);

  // Medicinal properties
  const medicinalProperties = plant.medicinal_properties || plant.medicinalProperties || [];
  const propsList = Array.isArray(medicinalProperties) ? medicinalProperties : [medicinalProperties].filter(Boolean);

  // Precautions - handle both string and array
  const precautionsData = plant.precautions || [];
  const precautionsList = Array.isArray(precautionsData) ? precautionsData : [precautionsData].filter(Boolean);

  // Description
  const description = plant.description || '';

  // Dosha effect (old format)
  const doshaEffect = plant.doshaEffect || '';

  // Common names (old format)
  const commonNames = plant.commonNames || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/explorer" className="inline-flex items-center gap-2 text-gray-400 hover:text-herb-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Explorer
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Quick Info */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            {/* Image */}
            <div className="glass-card overflow-hidden mb-6">
              <div className="relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-dark-700 animate-pulse flex items-center justify-center h-80">
                    <span className="text-4xl">🌿</span>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={plantName}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  className={`w-full h-80 object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleBookmark(numericId)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${bookmarked ? 'bg-herb-500 text-white' : 'bg-dark-800/80 backdrop-blur text-gray-400 hover:text-herb-400'
                      }`}
                  >
                    {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-dark-800/80 backdrop-blur text-gray-400 hover:text-herb-400 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePlayAudio}
                    disabled={audioLoading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPlaying
                      ? 'bg-herb-500 text-white'
                      : 'bg-dark-800/80 backdrop-blur text-gray-400 hover:text-herb-400'
                      }`}
                    title={isPlaying ? 'Pause audio' : 'Play audio narration'}
                  >
                    {audioLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className="font-display font-bold text-3xl text-white mb-2">{plantName}</h1>
                <p className="text-herb-400 italic mb-4">{botanicalName}</p>

                {/* Common Names */}
                {commonNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonNames.map((name, i) => (
                      <span key={i} className="px-3 py-1 bg-dark-600 text-gray-300 text-sm rounded-lg">
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                {/* AYUSH System */}
                <span className="px-3 py-1 bg-herb-500/10 text-herb-400 text-sm rounded-lg border border-herb-500/30">
                  {ayushSystem}
                </span>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-white mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Region</p>
                    <p className="text-white">{region}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-herb-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Part Used</p>
                    <p className="text-white">{partUsed}</p>
                  </div>
                </div>
                {diseaseList.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-herb-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Category</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {diseaseList.map((cat, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {doshaEffect && (
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-herb-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Dosha Effect</p>
                      <p className="text-white">{doshaEffect}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            {/* Description */}
            {description && (
              <div className="glass-card p-6 mb-6">
                <h3 className="font-display font-semibold text-white mb-4">About</h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Medicinal Properties */}
            {propsList.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <h3 className="font-display font-semibold text-white mb-4">Medicinal Properties</h3>
                <div className="flex flex-wrap gap-2">
                  {propsList.map((prop, i) => (
                    <span key={i} className="px-4 py-2 bg-herb-500/10 text-herb-400 rounded-xl border border-herb-500/20">
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Therapeutic Uses */}
            {usesList.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <h3 className="font-display font-semibold text-white mb-4">Therapeutic Uses</h3>
                <ul className="space-y-3">
                  {usesList.map((use, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-herb-500 rounded-full" />
                      <span className="text-gray-300">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precautions */}
            {precautionsList.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <p className="text-yellow-400">Always consult a qualified practitioner before using medicinal plants.</p>
                </div>
                <h3 className="font-display font-semibold text-white mb-4">Precautions</h3>
                <ul className="space-y-3">
                  {precautionsList.map((precaution, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Plants */}
            {relatedPlants.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-white mb-6">Related Plants</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPlants.map(rp => {
                    const rpId = rp.jsonId ?? rp.id;
                    return (
                      <Link key={rpId} to={`/plant/${rpId}`} className="group">
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                          <img
                            src={rp.new_url || rp.image}
                            alt={rp.common_name || rp.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-dark-900/50 group-hover:bg-dark-900/30 transition-colors" />
                        </div>
                        <h4 className="text-white font-medium group-hover:text-herb-400 transition-colors line-clamp-1">
                          {rp.common_name || rp.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {rp.ayush_system || (Array.isArray(rp.ayushSystem) ? rp.ayushSystem[0] : rp.ayushSystem)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
