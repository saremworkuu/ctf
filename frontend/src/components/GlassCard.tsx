import React from 'react';
import { motion } from 'motion/react';
import { NFT } from '../types';
import { cn } from '../lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface GlassCardProps {
  nft: NFT;
  className?: string;
  index?: number;
  onClick?: () => void;
}

export default function GlassCard({ nft, className, index = 0, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={cn(
        "group relative glass-morphism rounded-3xl overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vault-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest text-white uppercase">
          {nft.rarity}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
              {nft.collection}
            </p>
            <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors">
              {nft.name}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-vault-black transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Floor Price</p>
            <p className="text-lg font-mono font-medium text-white">{nft.price}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Owner</p>
            <p className="text-sm font-mono text-white/80">{nft.owner}</p>
          </div>
        </div>
      </div>

      {/* Decorative inner glow */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
    </motion.div>
  );
}
