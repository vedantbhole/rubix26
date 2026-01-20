import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Leaf, CheckCircle, AlertCircle } from 'lucide-react';
import { login } from '../store/authSlice';

const API_URL = 'http://localhost:5001/api';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return false;
        }
        if (!formData.email.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return false;
        }
        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return false;
        }
        if (!isLogin) {
            if (!formData.name) {
                setMessage({ type: 'error', text: 'Please enter your name' });
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match' });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Dispatch Redux login action
            dispatch(login(data.data));

            setMessage({
                type: 'success',
                text: isLogin ? 'Login successful! Redirecting...' : 'Account created! Redirecting...'
            });

            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            console.error('Auth error:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage({ type: '', text: '' });
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-herb-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-herb-600/10 rounded-full blur-3xl" />

            <div className="section-container relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 md:p-10"
                >
                    {/* Logo Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-herb-500 to-herb-700 mb-4 shadow-lg shadow-herb-500/30"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Leaf className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="font-display font-bold text-2xl text-white mb-2">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h1>
                        <p className="text-gray-400">
                            {isLogin
                                ? 'Sign in to explore the herbal garden'
                                : 'Join us to discover medicinal plants'}
                        </p>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex mb-8 p-1 bg-dark-700/50 rounded-xl">
                        <button
                            onClick={() => !isLogin && toggleMode()}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${isLogin
                                    ? 'bg-gradient-to-r from-herb-600 to-herb-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => isLogin && toggleMode()}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${!isLogin
                                    ? 'bg-gradient-to-r from-herb-600 to-herb-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
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
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="confirm-password-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:border-herb-500 focus:ring-1 focus:ring-herb-500 transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-sm text-herb-400 hover:text-herb-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-sm mt-8">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={toggleMode}
                            className="text-herb-400 hover:text-herb-300 font-medium transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>

                    {/* Back to Home */}
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm mt-6 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
