import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Search, User, Map, Bookmark, Home, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '../store/authSlice';

const API_URL = 'http://localhost:5001/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Only apply hidden logic on Home page
    if (location.pathname === '/') {
      const handleScroll = () => {
        const threshold = window.innerHeight * 2;
        if (window.scrollY < threshold) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      };

      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explorer', label: 'Plant Explorer', icon: Leaf },
    { path: '/compendium', label: 'Compendium', icon: Search },
    { path: '/tours', label: 'Thematic Tours', icon: Map },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  const isActive = (path) => location.pathname === path;

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
      setShowUserMenu(false);
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 glass transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-herb-500 to-herb-700 flex items-center justify-center shadow-lg shadow-herb-500/30 group-hover:shadow-herb-500/50 transition-shadow duration-300">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-herb-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl text-white">Virtual Herbal</h1>
              <p className="text-xs text-herb-400 font-medium tracking-wider">AYUSH GARDEN</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${isActive(link.path)
                    ? 'text-herb-400'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-herb-500/10 border border-herb-500/30 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:block">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-600/50 hover:bg-dark-600 transition-colors border border-herb-500/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-herb-500 to-herb-700 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 py-2 glass-card border border-herb-500/20 rounded-xl shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-herb-500/10">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-600/50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-600/50 transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          My Bookmarks
                        </Link>
                      </div>
                      <div className="border-t border-herb-500/10 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-herb-500/10">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(link.path)
                        ? 'bg-herb-500/10 text-herb-400 border border-herb-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-dark-600'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Auth Section */}
                {isAuthenticated && user ? (
                  <>
                    <div className="border-t border-herb-500/10 pt-4 mt-4">
                      <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-herb-500 to-herb-700 flex items-center justify-center">
                          <span className="font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
