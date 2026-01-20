import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Camera, Leaf, ArrowRight, Save, Trash2, Edit2, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { logout, updateUser, removeBookmark } from '../store/authSlice';
import { plants } from '../data/plants';

const API_URL = 'http://localhost:5001/api';

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Initialize form data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // Get bookmarked plants from local data using user's bookmarkedPlants IDs
    const bookmarkedPlants = user?.bookmarkedPlants
        ?.map(id => plants.find(p => p.id === parseInt(id) || p.id === id))
        .filter(Boolean) || [];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            dispatch(updateUser(data.data));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveBookmark = async (plantId) => {
        try {
            const response = await fetch(`${API_URL}/auth/bookmarks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ plantId: String(plantId), action: 'remove' }),
            });

            if (response.ok) {
                dispatch(removeBookmark(String(plantId)));
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(logout());
            navigate('/');
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="section-container max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display font-bold text-4xl text-white mb-2">
                            Your <span className="text-gradient">Profile</span>
                        </h1>
                        <p className="text-gray-400">Manage your account and bookmarks</p>
                    </div>

                    {/* Profile Card */}
                    <div className="glass-card p-8 mb-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-herb-500 to-herb-700 flex items-center justify-center shadow-lg shadow-herb-500/30">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-dark-600 rounded-full border border-herb-500/30 hover:bg-dark-500 transition-colors">
                                    <Camera className="w-4 h-4 text-herb-400" />
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="font-display font-bold text-2xl text-white">{user.name}</h2>
                                <p className="text-gray-400">{user.email}</p>
                                <p className="text-herb-400 text-sm mt-1">
                                    {bookmarkedPlants.length} bookmarked plants
                                </p>
                            </div>
                            <div className="md:ml-auto flex gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Message Display */}
                        <AnimatePresence mode="wait">
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error'
                                            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                                            : 'bg-herb-500/10 border border-herb-500/30 text-herb-400'
                                        }`}
                                >
                                    {message.type === 'error'
                                        ? <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        : <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    }
                                    <span className="text-sm">{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Edit Form */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-5 border-t border-herb-500/10 pt-6"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bookmarked Plants */}
                    <div className="glass-card p-8">
                        <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-herb-400" />
                            Bookmarked Plants
                        </h3>

                        {bookmarkedPlants.length === 0 ? (
                            <div className="text-center py-12">
                                <Leaf className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 mb-4">No bookmarked plants yet</p>
                                <Link to="/explorer" className="btn-primary inline-flex items-center gap-2">
                                    Explore Plants
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bookmarkedPlants.map((plant) => (
                                    <motion.div
                                        key={plant.id}
                                        layout
                                        className="flex items-center gap-4 p-4 bg-dark-700/50 rounded-xl border border-herb-500/10 hover:border-herb-500/30 transition-colors"
                                    >
                                        <img
                                            src={plant.image}
                                            alt={plant.name}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-white truncate">{plant.name}</h4>
                                            <p className="text-sm text-gray-400 truncate">{plant.botanicalName}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/plant/${plant.id}`}
                                                className="p-2 text-herb-400 hover:bg-herb-500/10 rounded-lg transition-colors"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveBookmark(plant.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
