import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import { ApiNFT } from '../types';
import { apiGetNFTs } from '../services/api';

export default function Home() {
  const navigate = useNavigate();

  // ── Live NFT data from API ────────────────────────────────────────────────
  const [allNFTs, setAllNFTs] = useState<ApiNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetNFTs()
      .then(setAllNFTs)
      .catch(() => setAllNFTs([]))
      .finally(() => setLoading(false));
  }, []);

  // Slice API data into sections
  const featuredMasterpieces = allNFTs.slice(0, 3);
  const exclusiveDeals = allNFTs.slice(0, 6); // duplicate for marquee

  // ── Fallback placeholder image ────────────────────────────────────────────
  function handleImgErr(e: React.SyntheticEvent<HTMLImageElement>) {
    (e.target as HTMLImageElement).src = '/image/0d807da914c254988ee3b7c9cba2d669.jpg';
  }

  return (
    <div className="relative min-h-screen bg-bayc-cream">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full-Bleed Background */}
        <div className="absolute inset-0 z-[-1]">
          <img
            src="/image/e35d2f2e89c1a4db7b2586f284814c2f.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
            onError={handleImgErr}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <ThreeScene />

        {/* Headline */}
        <div className="absolute inset-x-0 bottom-[15%] flex flex-col items-center z-10 pointer-events-none px-6">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="text-[10px] md:text-sm font-mono font-bold tracking-[0.6em] text-bayc-gold uppercase text-center max-w-4xl"
          >
            {'AUTHENTICATED_ARCHIVE_PROTOCOL'.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-30"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-bayc-text italic">Scroll</p>
        </motion.div>
      </section>

      {/* ── Featured Masterpieces ─────────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-12 bg-bayc-cream border-t border-bayc-text/5">
        <div className="max-w-[1200px] mx-auto space-y-20">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold text-bayc-text uppercase tracking-tight italic">
              Featured Masterpieces
            </h3>
            <Link
              to="/gallery"
              className="group flex items-center space-x-2 text-bayc-text/60 hover:text-bayc-text transition-colors"
            >
              <span className="uppercase tracking-widest text-[10px] font-bold">Explore All</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-bayc-gold animate-spin" />
            </div>
          ) : featuredMasterpieces.length === 0 ? (
            <p className="text-bayc-text/40 text-center py-20 uppercase tracking-widest text-xs font-bold">
              No assets found — make sure the backend is running
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {featuredMasterpieces.map((nft, idx) => (
                <motion.div
                  key={nft.nftId}
                  initial={{ opacity: 0, y: -200, rotate: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    type: 'spring',
                    stiffness: 40,
                    damping: 15,
                    mass: 1.2,
                    delay: idx * 0.15,
                  }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/nft/${nft.nftId}`)}
                >
                  <div className="aspect-[4/5] overflow-hidden max-h-80 bg-white shadow-xl rounded-[2.5rem]">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={handleImgErr}
                    />
                  </div>
                  <div className="pt-4 space-y-1">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] line-clamp-1">{nft.name}</h4>
                    <p className="text-xs font-mono text-bayc-text/50">{nft.price} ETH</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Exclusive Deals (Marquee) ─────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-12 bg-bayc-cream border-t border-bayc-text/5">
        <div className="max-w-[1600px] mx-auto space-y-12">
          <div className="space-y-4">
            <h3 className="text-4xl font-display font-bold text-bayc-text uppercase italic tracking-tight">
              Exclusive Deals
            </h3>
            <p className="text-bayc-text/40 font-mono text-[10px] tracking-[0.4em] uppercase">
              H_RANKED PROTOCOL ENTITIES
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-bayc-gold animate-spin" />
            </div>
          ) : exclusiveDeals.length === 0 ? (
            <p className="text-bayc-text/40 text-center py-10 uppercase tracking-widest text-xs font-bold">
              Connect to the backend to view deals
            </p>
          ) : (
            <div className="relative overflow-hidden">
              <style>{`
                @keyframes scroll-left {
                  0%   { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .marquee-container {
                  display: flex;
                  animation: scroll-left 8s linear infinite;
                }
                .marquee-container:hover { animation-play-state: paused; }
              `}</style>

              <div className="flex space-x-12 marquee-container">
                {/* Duplicate for seamless loop */}
                {[...exclusiveDeals, ...exclusiveDeals].map((nft, idx) => (
                  <motion.div
                    key={`${nft.nftId}-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, delay: Math.min(idx * 0.1, 0.5), ease: 'easeOut' }}
                    className="flex-shrink-0 w-48 space-y-4 group transition-all cursor-pointer"
                    onClick={() => navigate(`/nft/${nft.nftId}`)}
                  >
                    <div className="aspect-[4/5] overflow-hidden transition-all duration-700 rounded-lg">
                      <img
                        src={nft.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={nft.name}
                        onError={handleImgErr}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold tracking-widest">
                        <p className="font-mono text-bayc-text/30">
                          {String((idx % exclusiveDeals.length) + 1).padStart(2, '0')}
                        </p>
                        <p className="text-bayc-gold italic">Members Exclusive</p>
                      </div>
                      <h6 className="font-bold text-xs uppercase tracking-[0.2em] group-hover:text-bayc-gold transition-colors line-clamp-1">
                        {nft.name}
                      </h6>
                      <p className="text-[10px] font-mono text-bayc-text/60">{nft.price} ETH</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-20 border-t border-bayc-text/5 bg-bayc-cream px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <p className="text-bayc-text/30 text-xs">© 2026 ARCHIVE PROTOCOL. ALL ASSETS SECURED.</p>
          </div>
          <div className="flex gap-12">
            {[
              { label: 'Community', links: ['Discord', 'Twitter', 'Telegram'] },
              { label: 'Protocol', links: ['Docs', 'Audits'] },
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h5 className="text-[10px] font-bold text-bayc-text uppercase tracking-widest">{col.label}</h5>
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
