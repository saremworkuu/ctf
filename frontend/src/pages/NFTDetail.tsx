import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Loader2,
  AlertCircle,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { ApiNFT } from '../types';
import { apiGetNFT, apiAddToCart } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function NFTDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, refreshCartCount } = useAuth();

  // ── NFT data ──────────────────────────────────────────────────────────────
  const [nft, setNft] = useState<ApiNFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    async function loadNFT() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiGetNFT(parseInt(id));
        setNft(data);
      } catch (err: any) {
        setFetchError(err.message || 'NFT not found');
      } finally {
        setLoading(false);
      }
    }
    loadNFT();
  }, [id]);

  // ── Cart action ───────────────────────────────────────────────────────────
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState('');

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!nft) return;

    setCartLoading(true);
    setCartError('');
    setCartSuccess(false);

    try {
      await apiAddToCart(nft.nftId);
      await refreshCartCount();
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err: any) {
      setCartError(err.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  }

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-bayc-cream flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-bayc-gold animate-spin" />
          <p className="text-bayc-text/40 text-sm uppercase tracking-widest font-bold">
            Loading asset...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError || !nft) {
    return (
      <div className="pt-24 min-h-screen bg-bayc-cream flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center px-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-bayc-text/60 text-sm">{fetchError || 'NFT not found'}</p>
          <Link
            to="/gallery"
            className="px-6 py-3 bg-bayc-text text-white text-[10px] uppercase tracking-widest font-bold hover:bg-bayc-gold transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-bayc-cream text-bayc-text">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <Link
          to="/gallery"
          className="inline-flex items-center space-x-2 text-bayc-text/50 hover:text-bayc-gold transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-[10px] font-bold">
            Back to collection
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Visual Showcase */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 bg-white shadow-xl overflow-hidden rounded-2xl"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/image/0d807da914c254988ee3b7c9cba2d669.jpg';
                }}
              />
            </motion.div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {['View High Res', 'Provenance', 'Details'].map((view) => (
                <button
                  key={view}
                  className="border border-bayc-text/10 py-3 text-[10px] font-bold uppercase tracking-widest text-bayc-text/40 hover:text-bayc-text hover:border-bayc-text transition-all rounded-lg italic"
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Details & Acquisition */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-bayc-gold text-white text-[9px] font-bold tracking-widest uppercase rounded-full">
                    {nft.category}
                  </span>
                  <span className="text-bayc-text/40 text-[9px] uppercase font-bold tracking-widest font-mono">
                    #{nft.nftId}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-bold uppercase tracking-tight leading-none">
                  {nft.name}
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-bayc-gold/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-bayc-gold" />
                  </div>
                  <p className="text-xs font-medium text-bayc-text/60 italic">
                    {nft.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="border-t border-b border-bayc-text/5 py-8 space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-bayc-text/40 text-[10px] uppercase tracking-widest font-bold mb-2">
                    Price
                  </p>
                  <p className="text-3xl font-mono font-bold tracking-tighter">
                    {nft.price} ETH
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-bayc-gold font-bold italic">
                    <span className="text-[10px] uppercase tracking-widest">
                      {isAuthenticated ? 'Available' : 'Members Only'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart feedback */}
              {cartError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600">{cartError}</p>
                </motion.div>
              )}
              {cartSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-600">Added to cart!</p>
                </motion.div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  id="nft-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="w-full bg-bayc-text text-bayc-cream py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-bayc-gold transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : cartSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  {cartLoading
                    ? 'Adding...'
                    : cartSuccess
                    ? 'Added to Cart'
                    : isAuthenticated
                    ? 'Add to Cart'
                    : 'Login to Purchase'}
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 border border-bayc-text/10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors">
                    Make Offer
                  </button>
                  <button className="px-8 border border-bayc-text/10 hover:bg-white transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* NFT Info Card */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-bayc-text/40 italic">
                Asset Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'NFT ID', value: `#${nft.nftId}` },
                  { label: 'Category', value: nft.category },
                  { label: 'Price', value: `${nft.price} ETH` },
                ].map((attr, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 border border-bayc-text/5 hover:border-bayc-gold/20 transition-all"
                  >
                    <p className="text-[9px] text-bayc-text/40 uppercase tracking-widest font-bold mb-2">
                      {attr.label}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-tighter">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-bayc-text/5 bg-bayc-cream px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-bayc-text/30 text-xs">
            © 2026 ARCHIVE PROTOCOL. ALL ASSETS SECURED.
          </p>
          <div className="flex gap-12">
            {[
              { label: 'Community', links: ['Discord', 'Twitter', 'Telegram'] },
              { label: 'Protocol', links: ['Docs', 'Audits'] },
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h5 className="text-[10px] font-bold text-bayc-text uppercase tracking-widest">
                  {col.label}
                </h5>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-bayc-text/40 hover:text-bayc-gold transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
