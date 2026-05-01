import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Home as HomeIcon, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import Cart from './pages/Cart.tsx';
import Auth from './pages/Auth.tsx';
import Profile from './pages/Profile.tsx';
import OrderDetails from './pages/OrderDetails.tsx';

export interface UserData {
  userId: number;
  username: string;
  role: string;
  token: string;
}

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="scanline" />
        
        {/* Navbar */}
        <nav className="border-b border-border bg-dark/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <Shield className="w-8 h-8 text-brand group-hover:rotate-12 transition-transform" />
                <span className="font-mono font-bold tracking-tighter text-xl hidden sm:block">
                  AUTHENTICATED<span className="text-brand">_ARCHIVE</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="hover:text-brand transition-colors font-mono text-sm uppercase">Home</Link>
                <Link to="/shop" className="hover:text-brand transition-colors font-mono text-sm uppercase">Browse NFTs</Link>
                <Link to="/cart" className="flex items-center gap-1 hover:text-brand transition-colors font-mono text-sm uppercase">
                  <ShoppingCart className="w-4 h-4" /> Cart
                </Link>
                {user ? (
                  <div className="flex items-center gap-4 border-l border-border pl-8">
                    <Link to={`/profile/${user.userId}`} className="flex items-center gap-2 hover:text-brand font-mono text-sm uppercase">
                      <UserIcon className="w-4 h-4" /> {user.username}
                    </Link>
                    <button onClick={logout} className="text-red-500 hover:text-red-400 font-mono text-sm uppercase flex items-center gap-1">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" className="brutal-btn py-2 text-xs">Sign In</Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400 hover:text-white">
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-border bg-dark/95"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link to="/" className="block px-3 py-2 font-mono" onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link to="/shop" className="block px-3 py-2 font-mono" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                  <Link to="/cart" className="block px-3 py-2 font-mono" onClick={() => setIsMenuOpen(false)}>Cart</Link>
                  {user ? (
                    <>
                      <Link to={`/profile/${user.userId}`} className="block px-3 py-2 font-mono text-brand" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                      <button onClick={logout} className="block w-full text-left px-3 py-2 font-mono text-red-500">Log Out</button>
                    </>
                  ) : (
                    <Link to="/auth" className="block px-3 py-2 font-mono text-brand" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop user={user} />} />
            <Route path="/cart" element={<Cart user={user} />} />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="/profile/:id" element={<Profile user={user} />} />
            <Route path="/order/:id" element={<OrderDetails user={user} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 bg-dark/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-mono text-xs text-gray-500">
              AUTHENTICATED_ARCHIVE_PROTOCOL // V1.0 // SECURED BY BORED_APE_GUARDIAN
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
