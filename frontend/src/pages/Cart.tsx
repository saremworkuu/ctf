import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import { ApiCartItem } from '../types';
import { apiGetCart, apiRemoveFromCart, apiCreateOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, refreshCartCount } = useAuth();

  // ── Cart data ─────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  async function loadCart() {
    try {
      setLoading(true);
      setFetchError('');
      const items = await apiGetCart();
      setCartItems(items);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  // ── Remove ────────────────────────────────────────────────────────────────
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function handleRemove(nftId: number) {
    setRemovingId(nftId);
    try {
      await apiRemoveFromCart(nftId);
      setCartItems((prev) => prev.filter((i) => i.nftId !== nftId));
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  }

  // ── Checkout ─────────────────────────────────────────────────────────────
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError('');
    try {
      const result = await apiCreateOrder();
      setCheckoutSuccess(true);
      setCartItems([]);
      await refreshCartCount();
    } catch (err: any) {
      setCheckoutError(err.message || 'Order failed');
    } finally {
      setCheckoutLoading(false);
    }
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.nft?.price || '0');
    return acc + price * item.quantity;
  }, 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="pt-32 pb-20 px-12 min-h-screen bg-bayc-cream">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <Link
          to="/gallery"
          className="inline-flex items-center space-x-2 text-bayc-text/50 hover:text-bayc-gold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-[10px] font-bold">
            Continue Shopping
          </span>
        </Link>

        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-bayc-text uppercase tracking-tight">
            Your Cart
          </h2>
          <p className="text-bayc-text/60">
            Review your selected digital assets before checkout.
          </p>
        </div>

        {/* Not logged in */}
        {!isAuthenticated ? (
          <div className="text-center py-24 bg-white border border-bayc-text/5 rounded-2xl space-y-6">
            <Lock className="w-10 h-10 text-bayc-text/20 mx-auto" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-bayc-text/40">
              Authentication Required
            </h3>
            <p className="text-bayc-text/40 text-sm">
              Please log in to view and manage your cart.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-bayc-text text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-bayc-gold transition-all"
            >
              Log In / Sign Up
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-bayc-gold animate-spin" />
            <p className="text-bayc-text/40 text-sm uppercase tracking-widest font-bold">
              Loading cart...
            </p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-bayc-text/60 text-sm">{fetchError}</p>
            <button
              onClick={loadCart}
              className="px-6 py-3 bg-bayc-text text-white text-[10px] uppercase tracking-widest font-bold hover:bg-bayc-gold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : checkoutSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white border border-bayc-text/5 rounded-2xl space-y-6"
          >
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold uppercase tracking-widest text-bayc-text">
              Order Placed!
            </h3>
            <p className="text-bayc-text/60 text-sm max-w-sm mx-auto">
              Your digital assets have been secured in the archive. Thank you for your transaction.
            </p>
            <button
              onClick={() => navigate('/gallery')}
              className="px-8 py-4 bg-bayc-text text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-bayc-gold transition-all"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.nftId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-6 p-6 bg-white border border-bayc-text/5 rounded-2xl"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bayc-cream">
                    <img
                      src={item.nft?.image || '/image/0d807da914c254988ee3b7c9cba2d669.jpg'}
                      alt={item.nft?.name || 'NFT'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/image/0d807da914c254988ee3b7c9cba2d669.jpg';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h4 className="font-bold uppercase tracking-[0.2em] text-sm">
                      {item.nft?.name || `NFT #${item.nftId}`}
                    </h4>
                    <p className="text-xs text-bayc-text/40 uppercase tracking-widest">
                      {item.nft?.category}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-mono font-bold">
                        {item.nft?.price} ETH
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-xs text-bayc-text/40">
                          × {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.nftId)}
                    disabled={removingId === item.nftId}
                    className="p-3 text-bayc-text/40 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 disabled:opacity-50"
                    title="Remove from cart"
                  >
                    {removingId === item.nftId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-2xl border border-bayc-text/5 space-y-8 h-fit">
              <h3 className="font-bold uppercase tracking-widest text-sm border-b border-bayc-text/5 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.nftId} className="flex justify-between text-sm">
                    <span className="text-bayc-text/60 truncate max-w-[140px]">
                      {item.nft?.name || `NFT #${item.nftId}`}
                      {item.quantity > 1 && ` ×${item.quantity}`}
                    </span>
                    <span className="font-mono font-bold">
                      {(parseFloat(item.nft?.price || '0') * item.quantity).toFixed(2)} ETH
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-sm">
                  <span className="text-bayc-text/60">Gas Fee (Est.)</span>
                  <span className="font-mono font-bold">0.01 ETH</span>
                </div>
              </div>

              <div className="pt-4 border-t border-bayc-text/5 flex justify-between">
                <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                <span className="text-xl font-mono font-bold">
                  {(subtotal + 0.01).toFixed(2)} ETH
                </span>
              </div>

              {checkoutError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600">{checkoutError}</p>
                </div>
              )}

              <button
                id="cart-checkout"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-bayc-text text-bayc-cream py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-bayc-gold transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-bayc-text/5 rounded-2xl space-y-4">
            <ShoppingBag className="w-10 h-10 text-bayc-text/20 mx-auto" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-bayc-text/40">
              Your cart is empty
            </h3>
            <p className="text-bayc-text/30 text-sm">
              Browse the gallery and add some NFTs.
            </p>
            <button
              onClick={() => navigate('/gallery')}
              className="mt-4 px-8 py-4 bg-bayc-text text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-bayc-gold transition-all"
            >
              Browse Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
