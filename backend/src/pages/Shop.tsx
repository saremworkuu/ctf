import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ExternalLink, Info } from 'lucide-react';
import { UserData } from '../App.tsx';

interface NFT {
  nftId: number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

export default function Shop({ user }: { user: UserData | null }) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/nfts')
      .then(res => res.json())
      .then(data => {
        setNfts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const addToCart = async (nftId: number) => {
    if (!user) {
      setMessage('You must be signed in to add to cart.');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ nftId })
      });
      
      if (res.ok) {
        setMessage('Added to cart successfully!');
      } else {
        setMessage('Failed to add to cart.');
      }
    } catch (err) {
      setMessage('Error connecting to protocol.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-center py-24 font-mono animate-pulse">SYNCHRONIZING_WITH_ARCHIVE...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Bored Ape <span className="text-brand">Archive</span></h2>
          <p className="text-gray-400 font-mono text-sm mt-2">ACTIVE_PRIMITIVES: {nfts.length}</p>
        </div>
        {message && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand/10 border border-brand text-brand px-4 py-2 font-mono text-xs rounded"
          >
            {message}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft, i) => (
          <motion.div
            key={nft.nftId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="brutal-card flex flex-col group"
          >
            <div className="relative aspect-square overflow-hidden bg-black/50">
              <img 
                src={nft.image} 
                alt={nft.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-dark/80 backdrop-blur-md border border-border text-[10px] font-mono text-brand uppercase">
                {nft.category}
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl uppercase tracking-tight">{nft.name}</h3>
                <span className="font-mono text-brand font-bold">{nft.price}</span>
              </div>
              <p className="text-gray-400 text-xs font-mono line-clamp-2">{nft.description}</p>
              
              <div className="mt-auto pt-4 flex gap-2">
                <button 
                  onClick={() => addToCart(nft.nftId)}
                  className="flex-grow brutal-btn py-3 text-xs flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <div className="px-3 border border-border flex items-center justify-center hover:bg-white/5 cursor-not-allowed opacity-50">
                  <Info className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
