import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ChevronDown, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { ApiNFT } from '../types';
import { apiGetNFTs } from '../services/api';

const ITEMS_PER_PAGE = 10;

const CATEGORIES = ['All', 'Art', 'Collectible', 'Gaming', 'Music', 'Photography'];

export default function Shop() {
  const navigate = useNavigate();

  // ── Data ────────────────────────────────────────────────────────────────────
  const [allNFTs, setAllNFTs] = useState<ApiNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    async function loadNFTs() {
      try {
        setLoading(true);
        const data = await apiGetNFTs();
        setAllNFTs(data);
      } catch (err: any) {
        setFetchError(err.message || 'Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    }
    loadNFTs();
  }, []);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest First');

  let filtered = allNFTs.filter((nft) =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (category !== 'All') {
    filtered = filtered.filter((nft) => nft.category === category);
  }

  if (sort === 'Price: Low to High') {
    filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sort === 'Price: High to Low') {
    filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else {
    // Newest: use nftId descending
    filtered = [...filtered].sort((a, b) => b.nftId - a.nftId);
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery, category, sort]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pt-32 pb-20 px-12 min-h-screen bg-bayc-cream">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-bayc-text uppercase tracking-tight">
            Shop All Products
          </h2>
          <p className="text-bayc-text/60 max-w-2xl">
            Discover our curated collection of premium digital assets and exclusive NFTs
          </p>
        </div>

        {/* Filter / Search / Sort bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-bayc-text/20 rounded-lg text-sm font-medium text-bayc-text hover:border-bayc-text transition-colors appearance-none cursor-pointer pr-10"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bayc-text" />
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-bayc-text/40" />
            </div>
            <input
              id="shop-search"
              type="text"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-bayc-text/20 rounded-lg text-sm text-bayc-text placeholder:text-bayc-text/40 focus:outline-none focus:border-bayc-gold focus:ring-2 focus:ring-bayc-gold/20"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-bayc-text/20 rounded-lg text-sm font-medium text-bayc-text hover:border-bayc-text transition-colors appearance-none cursor-pointer pr-10"
            >
              <option value="Newest First">Newest First</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bayc-text" />
          </div>
        </div>

        {/* States: loading / error / grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-bayc-gold animate-spin" />
            <p className="text-bayc-text/40 text-sm uppercase tracking-widest font-bold">
              Loading vault contents...
            </p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-bayc-text/60 text-sm">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-bayc-text text-white text-[10px] uppercase tracking-widest font-bold hover:bg-bayc-gold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Results count */}
            <p className="text-bayc-text/40 text-xs uppercase tracking-widest font-bold">
              {filtered.length} asset{filtered.length !== 1 ? 's' : ''} found
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white border border-bayc-text/5 rounded-2xl">
                <p className="text-bayc-text/40 uppercase tracking-widest text-sm font-bold">
                  No NFTs match your search
                </p>
              </div>
            ) : (
              <>
                {/* NFT Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {paginated.map((nft, idx) => (
                    <motion.div
                      key={`${nft.nftId}-${currentPage}`}
                      initial={{ opacity: 0, y: 80, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 1.2,
                        delay: idx * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="space-y-4 group cursor-pointer"
                      onClick={() => navigate(`/nft/${nft.nftId}`)}
                    >
                      <div className="aspect-[3/4] bg-white rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-700">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/image/0d807da914c254988ee3b7c9cba2d669.jpg';
                          }}
                        />
                      </div>
                      <div className="pt-2 space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] line-clamp-1">
                          {nft.name}
                        </h4>
                        <p className="text-xs font-mono text-bayc-text/50">{nft.price} ETH</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-bayc-text/20 rounded-full hover:bg-bayc-text hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-bayc-text"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn(
                            'w-10 h-10 rounded-full text-sm font-bold transition-colors',
                            currentPage === i + 1
                              ? 'bg-bayc-text text-white'
                              : 'border border-bayc-text/20 hover:border-bayc-text'
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-bayc-text/20 rounded-full hover:bg-bayc-text hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-bayc-text"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-bayc-text/5 bg-bayc-cream px-12 mt-20">
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
