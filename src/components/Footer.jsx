import { Link } from 'react-router-dom';
import { Leaf, Heart, Github, Twitter, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-800 border-t border-herb-500/10">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-herb-500/50 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-herb-500 to-herb-700 flex items-center justify-center shadow-lg shadow-herb-500/30">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Virtual Herbal</h3>
                <p className="text-xs text-herb-400 font-medium">AYUSH GARDEN</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover the ancient wisdom of medicinal plants through our interactive digital garden. 
              Learn about AYUSH systems and traditional healing.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-herb-400 hover:bg-dark-500 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-herb-400 hover:bg-dark-500 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-herb-400 hover:bg-dark-500 transition-all duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Plant Explorer', 'Compendium', 'Thematic Tours', 'Bookmarks'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link === 'Home' ? '' : link.toLowerCase().replace(' ', '-').replace('plant-', '')}`}
                    className="text-gray-400 hover:text-herb-400 transition-colors duration-300 text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AYUSH Systems */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">AYUSH Systems</h4>
            <ul className="space-y-3">
              {['Ayurveda', 'Yoga & Naturopathy', 'Unani', 'Siddha', 'Homeopathy'].map((system) => (
                <li key={system}>
                  <span className="text-gray-400 text-sm">{system}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to learn about new plants and traditional medicine insights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-3 bg-dark-600 border border-herb-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-herb-500/50 transition-colors"
              />
              <button className="px-4 py-3 bg-herb-600 text-white rounded-xl hover:bg-herb-500 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-herb-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for AYUSH • © {currentYear}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-herb-400 text-sm transition-colors duration-300"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
