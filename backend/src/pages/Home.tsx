import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Terminal, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none">
            The Elite <span className="text-brand">Archive</span> Protocol
          </h1>
          <p className="text-xl text-gray-400 mt-6 font-mono max-w-2xl mx-auto">
            Decentralized marketplace for high-net-worth digital primitives. 
            Only verified operators admitted into the archive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/shop" className="brutal-btn text-lg px-12">Enter Marketplace</Link>
          <Link to="/auth" className="border border-white/20 hover:bg-white/5 py-3 px-12 font-mono uppercase tracking-widest text-sm transition-all">Agent Sign-In</Link>
        </motion.div>
      </section>

      {/* Security Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Lock className="w-8 h-8 text-brand" />, title: "Encrypted Storage", desc: "All protocol data is sharded and encrypted at rest." },
          { icon: <Terminal className="w-8 h-8 text-brand" />, title: "Audit Ready", desc: "Verifiable order history recorded on the secure archive." },
          { icon: <Cpu className="w-8 h-8 text-brand" />, title: "Agent Isolation", desc: "Deep sandboxing for all transaction processing modules." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * i }}
            className="brutal-card p-8 space-y-4"
          >
            {item.icon}
            <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Banner */}
      <section className="relative h-[400px] overflow-hidden rounded-xl border border-border flex items-center justify-center">
        <img 
          src="https://gateway.pinata.cloud/ipfs/QmeSjSinHpRuzXGO9MRsybtXPqbDxrzBut4WvTvWB18W6r" 
          alt="Bored Ape" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="relative text-center space-y-4 px-4">
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Bored Ape #001</h2>
          <p className="font-mono text-brand">ESTIMATED VALUATION: 99.00 ETH</p>
          <div className="inline-block px-4 py-1 border border-brand text-brand text-xs font-mono animate-pulse">
            RESTRICTED ACCESS
          </div>
        </div>
      </section>
    </div>
  );
}
