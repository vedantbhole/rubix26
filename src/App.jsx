import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookmarksProvider } from './hooks/useBookmarks';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import AuthInitializer from './components/AuthInitializer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import PlantExplorer from './pages/PlantExplorer';
import PlantProfile from './pages/PlantProfile';
import Compendium from './pages/Compendium';
import ThematicTours from './pages/ThematicTours';
import Bookmarks from './pages/Bookmarks';
import GardenTour from './pages/GardenTour';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthInitializer>
        <BookmarksProvider>
          <SmoothScroll>
            <Router>
              <div className="min-h-screen bg-dark-900 flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tour" element={<GardenTour />} />
                    <Route path="/explorer" element={<PlantExplorer />} />
                    <Route path="/plant/:id" element={<PlantProfile />} />
                    <Route path="/compendium" element={<Compendium />} />
                    <Route path="/tours" element={<ThematicTours />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Footer />
                <ChatBot />
              </div>
            </Router>
          </SmoothScroll>
        </BookmarksProvider>
      </AuthInitializer>
    </ErrorBoundary>
  );
}

export default App;

