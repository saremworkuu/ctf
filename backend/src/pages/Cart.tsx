import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { UserData } from '../App.tsx';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  _id: string;
  userId: number;
  nftId: number;
  quantity: number;
  nft: {
    name: string;
    price: string;
    image: string;
  };
}

export default function Cart({ user }: { user: UserData | null }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeItem = async (nftId: number) => {
    if (!user) return;
    try {
      await fetch(`/api/cart/${nftId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setItems(items.filter(item => item.nftId !== nftId));
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Redirect to first order for demo
        if (data.orders && data.orders.length > 0) {
          navigate(`/order/${data.orders[0].orderId}`);
        } else {
          fetchCart();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return (
    <div className="text-center py-24 space-y-4">
      <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto" />
      <h2 className="text-2xl font-bold uppercase tracking-tight">Protocol Access Denied</h2>
      <p className="text-gray-500 font-mono">Sign in to access your secure inventory container.</p>
      <Link to="/auth" className="brutal-btn inline-block">Sign In Now</Link>
    </div>
  );

  if (loading) return <div className="text-center py-24 font-mono animate-pulse">RETRIVING_SECURE_PAYLOTS...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h2 className="text-3xl font-bold uppercase tracking-tighter">Inventory <span className="text-brand">Ready</span></h2>
        <span className="font-mono text-xs px-2 py-1 bg-white/5 border border-border">ITEMS: {items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 brutal-border p-12 bg-white/5">
          <p className="font-mono text-gray-400">Carrier is empty. No assets flagged for extraction.</p>
          <Link to="/shop" className="text-brand font-mono text-sm uppercase mt-4 hover:underline inline-block">Browse Archive →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="brutal-card p-4 flex gap-6 items-center"
              >
                <img 
                  src={item.nft?.image} 
                  alt={item.nft?.name} 
                  className="w-20 h-20 object-cover border border-border"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg uppercase">{item.nft?.name}</h3>
                  <p className="text-brand font-mono text-sm">{item.nft?.price}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs opacity-50">QTY: {item.quantity}</span>
                  <button 
                    onClick={() => removeItem(item.nftId)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="pt-8 flex flex-col md:flex-row gap-8">
            <div className="flex-grow space-y-4 brutal-border p-6 bg-brand/5">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-gray-400 uppercase">Subtotal</span>
                <span>Calculating...</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-gray-400 uppercase">Protocol Fee</span>
                <span>0.005 ETH</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold uppercase tracking-tight">
                <span>Total Payload</span>
                <span className="text-brand">EXECUTE OMNI_CHECKOUT</span>
              </div>
            </div>
            
            <div className="md:w-1/3 flex items-end">
              <button 
                onClick={checkout}
                className="brutal-btn w-full py-6 flex items-center justify-center gap-3 group"
              >
                <CreditCard className="w-5 h-5" /> Confirm Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
