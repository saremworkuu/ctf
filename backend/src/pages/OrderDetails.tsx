import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Receipt, Package, Truck, CheckCircle, AlertTriangle, Flag } from 'lucide-react';
import { UserData } from '../App.tsx';

interface Order {
  orderId: number;
  buyerId: number;
  nftId: number;
  nftName: string;
  price: string;
  status: string;
  flag?: string;
  createdAt: string;
}

export default function OrderDetails({ user }: { user: UserData | null }) {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    fetch(`/api/orders/${id}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Transaction record not found in archive.');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, user]);

  if (!user) return <div className="text-center py-24 uppercase font-mono">Access Denied</div>;
  if (loading) return <div className="text-center py-24 font-mono animate-pulse">RECOVERING_ORDER_HASH...</div>;

  if (error) return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
      <h2 className="text-xl font-bold uppercase tracking-tight">Archive Error</h2>
      <p className="font-mono text-xs text-gray-500 uppercase">{error}</p>
      <Link to="/shop" className="brutal-btn inline-block text-xs">Return to Marketplace</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Order <span className="text-brand">#{order?.orderId}</span></h2>
          <p className="font-mono text-xs text-gray-500 uppercase">TIMESTAMP: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'PENDING'}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-brand uppercase border border-brand/30 px-3 py-1 bg-brand/5">
          <CheckCircle className="w-3 h-3" /> Status: {order?.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="brutal-card p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Package className="w-5 h-5 text-brand" />
            <span className="font-bold uppercase tracking-tight text-sm">Asset Information</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Product Name</span>
              <span className="font-bold">{order?.nftName}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Archive ID</span>
              <span>NFT_{order?.nftId}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Purchase Value</span>
              <span className="text-brand font-bold">{order?.price}</span>
            </div>
          </div>
        </div>

        <div className="brutal-card p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Receipt className="w-5 h-5 text-brand" />
            <span className="font-bold uppercase tracking-tight text-sm">Agent Data</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Buyer Reference</span>
              <span className="font-bold">AGENT_{order?.buyerId}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Verification Type</span>
              <span>PROTOCOL_SIGNED</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-500 uppercase">Archive Hash</span>
              <span className="text-xs opacity-50 font-mono truncate ml-4">
                {Math.random().toString(36).substring(2, 15)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {order?.flag && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brutal-border p-8 bg-brand/10 border-brand relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Flag className="w-24 h-24 text-brand rotate-12" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tighter text-brand text-2xl">
              <Flag className="w-6 h-6" /> Flag Recovered
            </div>
            <p className="font-mono text-xs text-gray-400 uppercase">
              DECRYPTED SENSITIVE METADATA DETECTED IN TRANSACTION PAYLOAD:
            </p>
            <div className="bg-black/80 border border-brand p-4 font-mono text-xl text-brand text-center tracking-widest break-all select-all">
              {order.flag}
            </div>
            <p className="font-mono text-[10px] text-gray-500 uppercase italic">
              Vulnerability: Identity Reference Misconfiguration (IDOR)
            </p>
          </div>
        </motion.div>
      )}

      {!order?.flag && (
        <div className="brutal-border p-8 bg-white/5 border-border space-y-4 text-center opacity-50">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            NO SENSITIVE FLAGS DETECTED FOR ORDER_{order?.orderId}
          </p>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <Link to="/shop" className="text-gray-500 hover:text-brand font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
          <Truck className="w-4 h-4" /> Return to Shipment Deck
        </Link>
      </div>
    </div>
  );
}
