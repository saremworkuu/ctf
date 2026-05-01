import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NFTDetail from './pages/NFTDetail';
import Auth from './pages/Auth';
import Shop from './pages/Shop';
import About from './pages/About';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-bayc-cream flex flex-col selection:bg-bayc-gold selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Shop />} />
                <Route path="/nft/:id" element={<NFTDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
