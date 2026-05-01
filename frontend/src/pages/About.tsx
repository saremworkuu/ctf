import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen bg-bayc-cream text-bayc-text">
      {/* Main Content Section */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                Bored Ape
                <br />
                <span className="text-bayc-gold italic">Marketplace</span>
              </h1>
              
              <div className="space-y-6 text-bayc-text/60 leading-relaxed">
                <p>
                  Welcome to the premier Bored Ape Yacht Club marketplace, 
                  where exclusive digital apes find their new homes. 
                  We specialize in connecting collectors with the most sought-after 
                  BAYC NFTs in the digital ecosystem.
                </p>
                <p>
                  Our platform offers a seamless trading experience for Bored Ape 
                  enthusiasts, featuring verified collections, secure transactions, 
                  and real-time market analytics. Join thousands of collectors 
                  who trust us for their BAYC investments.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-px h-8 bg-bayc-text/20" />
                <span className="text-sm font-mono tracking-widest text-bayc-text/40 uppercase">EST. 2024</span>
                <div className="w-px h-8 bg-bayc-text/20" />
              </div>
            </motion.div>
            
            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="/image/4cb2dd1b3a7d40203b4025ef3b17e64a.jpg" 
                alt="Bored Ape Marketplace" 
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-bayc-text/5 bg-bayc-cream px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <p className="text-bayc-text/30 text-xs">
              © 2026 ARCHIVE PROTOCOL. ALL ASSETS SECURED.
            </p>
          </div>
          
          <div className="flex gap-12">
            {[
              { label: "Community", links: ["Discord", "Twitter", "Telegram"] },
              { label: "Protocol", links: ["Docs", "Audits"] }
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h5 className="text-[10px] font-bold text-bayc-text uppercase tracking-widest">{col.label}</h5>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs text-bayc-text/40 hover:text-bayc-gold transition-colors">{link}</a>
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
