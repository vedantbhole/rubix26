import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookmarksProvider } from './hooks/useBookmarks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import PlantExplorer from './pages/PlantExplorer';
import PlantProfile from './pages/PlantProfile';
import Compendium from './pages/Compendium';
import ThematicTours from './pages/ThematicTours';
import Bookmarks from './pages/Bookmarks';
import GardenTour from './pages/GardenTour';
import './index.css';

function App() {
  return (
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SmoothScroll>
    </BookmarksProvider>
  );
}

export default App;
