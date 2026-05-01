import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, cartCount, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bayc-cream border-b border-bayc-text/5 px-8 py-4">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        {/* Left: nav links */}
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              'text-[10px] font-bold tracking-[0.2em] uppercase hover:text-bayc-gold transition-colors',
              isActive('/') ? 'text-bayc-gold' : 'text-bayc-text'
            )}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={cn(
              'text-[10px] font-bold tracking-[0.2em] uppercase hover:text-bayc-gold transition-colors',
              isActive('/about') ? 'text-bayc-gold' : 'text-bayc-text'
            )}
          >
            About
          </Link>
          <Link
            to="/gallery"
            className={cn(
              'text-[10px] font-bold tracking-[0.2em] uppercase hover:text-bayc-gold transition-colors',
              isActive('/gallery') ? 'text-bayc-gold' : 'text-bayc-text'
            )}
          >
            Shop
          </Link>
        </div>

        {/* Right: user + cart */}
        <div className="flex items-center space-x-6">
          {/* Username or user icon */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-bayc-text/60 hidden md:block">
                @{user.username}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-bayc-text/40 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5 stroke-1" />
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <User
                className={cn(
                  'w-6 h-6 stroke-1 hover:text-bayc-gold transition-colors',
                  isActive('/auth') ? 'text-bayc-gold' : ''
                )}
              />
            </Link>
          )}

          {/* Cart icon with badge */}
          <Link to="/cart" className="relative">
            <ShoppingCart
              className={cn(
                'w-6 h-6 stroke-1 transition-colors',
                isActive('/cart') ? 'text-bayc-gold' : 'hover:text-bayc-gold'
              )}
            />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-bayc-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
