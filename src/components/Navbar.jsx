import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Search, BookOpen, Map, Bookmark, Home } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explorer', label: 'Plant Explorer', icon: Leaf },
    { path: '/compendium', label: 'Compendium', icon: Search },
    { path: '/tours', label: 'Thematic Tours', icon: Map },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
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
                  className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                    isActive(link.path)
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

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/explorer" className="btn-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explore Now
            </Link>
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(link.path)
                          ? 'bg-herb-500/10 text-herb-400 border border-herb-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-dark-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  to="/explorer"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
