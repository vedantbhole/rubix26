import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Leaf, ArrowRight, Sparkles, ChevronDown, 
  BookOpen, Map, Search, Users, Award, Globe
} from 'lucide-react';
import ScrollPlantAnimation from '../components/ScrollPlantAnimation';
import PlantCard from '../components/PlantCard';
import { plants, healthThemes, ayushSystems } from '../data/plants';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Hero section is 300vh, sticky container takes 100vh
      // So we scroll through 200vh worth of content for the animation
      const animationScrollDistance = window.innerHeight * 2;
      const progress = Math.min(Math.max(scrollTop / animationScrollDistance, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  const stats = [
    { value: '16+', label: 'Medicinal Plants', icon: Leaf },
    { value: '5', label: 'AYUSH Systems', icon: Globe },
    { value: '8', label: 'Health Themes', icon: Award },
    { value: '1000+', label: 'Years of Wisdom', icon: Users },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full-Screen Scroll Animation */}
      <section 
        ref={heroRef}
        className="relative h-[300vh]"
      >
        {/* Fixed container for scroll animation - FULL SCREEN */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Full-screen plant animation as background */}
          <div className="absolute inset-0 z-0">
            <ScrollPlantAnimation progress={scrollProgress} />
          </div>

          {/* Dark overlay for better text readability */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0.2) 100%)'
            }}
          />

          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.3)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Text content overlay */}
          <motion.div 
            className="relative z-30 h-full flex flex-col justify-center px-8 lg:px-16 max-w-2xl"
            style={{ opacity, scale }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 w-fit"
              style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.3)' 
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#4ade80' }} />
              <span className="text-sm font-medium" style={{ color: '#4ade80' }}>AYUSH Ministry Initiative</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-bold text-5xl lg:text-7xl text-white mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Virtual
              <span className="block text-gradient glow-text">Herbal Garden</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg lg:text-xl leading-relaxed mb-8"
              style={{ color: '#9ca3af' }}
            >
              Explore the ancient wisdom of medicinal plants used in AYUSH systems. 
              An immersive digital experience for students, practitioners, and curious minds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/explorer" className="btn-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Plants
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tours" className="btn-secondary flex items-center gap-2">
                <Map className="w-5 h-5" />
                Take a Tour
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-8 lg:left-16 flex flex-col items-center gap-2"
            >
              <span className="text-sm" style={{ color: '#6b7280' }}>Scroll to grow</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6" style={{ color: '#22c55e' }} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-herb-glow opacity-50" />
        <div className="section-container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-herb-500/10 border border-herb-500/30 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-herb-400" />
                  </div>
                  <h3 className="font-display font-bold text-4xl text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AYUSH Systems Section */}
      <section className="py-24 relative">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
              AYUSH <span className="text-gradient">Systems</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Traditional medicine systems recognized by the Ministry of AYUSH, India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {ayushSystems.map((system, index) => (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center group hover:border-herb-500/40 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{system.icon}</div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-herb-400 transition-colors">
                  {system.name}
                </h3>
                <p className="text-herb-500 text-sm mb-3">{system.fullName}</p>
                <p className="text-gray-500 text-sm">{system.origin}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="py-24 bg-dark-800 relative">
        <div className="absolute inset-0 leaf-pattern opacity-30" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12"
          >
            <div>
              <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
                Featured <span className="text-gradient">Plants</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Discover some of the most powerful medicinal plants in traditional medicine
              </p>
            </div>
            <Link 
              to="/explorer"
              className="btn-secondary flex items-center gap-2 whitespace-nowrap"
            >
              View All Plants
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plants.slice(0, 6).map((plant, index) => (
              <PlantCard key={plant.id} plant={plant} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Health Themes Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
              Explore by <span className="text-gradient">Health Theme</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Take guided tours through plants organized by their therapeutic benefits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthThemes.slice(0, 8).map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/tours?theme=${theme.id}`}
                  className="block glass-card p-6 group hover:border-herb-500/40 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{theme.icon}</div>
                  <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-herb-400 transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{theme.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-herb-500 text-sm">{theme.plants.length} plants</span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-herb-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/tours" className="btn-primary inline-flex items-center gap-2">
              <Map className="w-5 h-5" />
              View All Tours
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-herb-900/20 via-transparent to-herb-900/10" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-herb-500/10 border border-herb-500/30 mb-8">
              <Search className="w-10 h-10 text-herb-400" />
            </div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-6">
              Ready to Explore the
              <span className="block text-gradient mt-2">Digital Compendium?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Search and filter plants by disease category, AYUSH discipline, 
              region, and more. Build your personal study lists and notes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/compendium" className="btn-primary flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Compendium
              </Link>
              <Link to="/bookmarks" className="btn-secondary flex items-center gap-2">
                Start Study List
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
