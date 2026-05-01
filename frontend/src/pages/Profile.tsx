import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Search,
  Loader2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Package,
  Users
} from 'lucide-react';
import { ApiUser, ApiOrder } from '../types';
import { apiGetMe, apiGetOrder, apiGetUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user: authUser } = useAuth();

  // ── Profile data ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileLoading(false);
      return;
    }
    apiGetMe()
      .then(setProfile)
      .catch((err: any) => setProfileError(err.message || 'Failed to load profile'))
      .finally(() => setProfileLoading(false));
  }, [isAuthenticated]);

  // ── Order lookup ──────────────────────────────────────────────────────────
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  async function handleOrderLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = parseInt(orderId.trim());
    if (isNaN(id)) return;
    setOrderLoading(true);
    setOrderError('');
    setOrder(null);
    try {
      const data = await apiGetOrder(id);
      setOrder(data);
    } catch (err: any) {
      setOrderError(err.message || 'Order not found');
    } finally {
      setOrderLoading(false);
    }
  }

  // ── User lookup ───────────────────────────────────────────────────────────
  const [lookupUserId, setLookupUserId] = useState('');
  const [lookedUpUser, setLookedUpUser] = useState<ApiUser | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  async function handleUserLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = parseInt(lookupUserId.trim());
    if (isNaN(id)) return;
    setUserLoading(true);
    setUserError('');
    setLookedUpUser(null);
    try {
      const data = await apiGetUser(id);
      setLookedUpUser(data);
    } catch (err: any) {
      setUserError(err.message || 'User not found');
    } finally {
      setUserLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-8 max-w-sm">
          <div className="w-20 h-20 bg-bayc-cream rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8 text-bayc-text/20" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-bayc-text">Identity Required</h2>
            <p className="text-bayc-text/40 text-sm">Please sign in to access your archive records.</p>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-4 bg-bayc-text text-white font-bold uppercase tracking-widest text-[10px] hover:bg-bayc-gold transition-all rounded-xl shadow-lg shadow-black/5"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-bayc-cream/30">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Sidebar: Identity ────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-bayc-cream rounded-[2rem] flex items-center justify-center border-2 border-white shadow-inner">
                <UserIcon className="w-10 h-10 text-bayc-gold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-bayc-text">{authUser?.username}</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-bayc-text/30">#{profile?.userId || '...'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-black/5 space-y-4">
              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 text-red-500 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bayc-text p-8 rounded-3xl text-white space-y-4"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">System Role</h3>
            <p className="text-lg font-bold">{profile?.role?.toUpperCase() || '...'}</p>
            <p className="text-xs opacity-50 font-mono break-all">{profile?.archiveSignature || 'No signature verified'}</p>
          </motion.div>
        </div>

        {/* ── Main: Tools ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-bayc-text/30 mb-8 flex items-center gap-2">
              <UserIcon className="w-3 h-3" /> Account Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-bayc-text/20 mb-1">Email Address</p>
                <p className="text-sm font-medium text-bayc-text">{profile?.email || '...'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-bayc-text/20 mb-1">Registration Date</p>
                <p className="text-sm font-medium text-bayc-text">
                  {profile ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-bayc-text/30 flex items-center gap-2">
                <Package className="w-3 h-3" /> Order Trace
              </h3>
              <form onSubmit={handleOrderLookup} className="relative">
                <input
                  type="text"
                  placeholder="ID (e.g. 1000)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-bayc-cream/50 border-none rounded-2xl p-4 text-sm font-mono text-bayc-text placeholder:text-bayc-text/20 outline-none focus:ring-2 focus:ring-bayc-gold/20"
                />
                <button 
                  type="submit"
                  disabled={orderLoading}
                  className="absolute right-2 top-2 p-2 bg-bayc-text text-white rounded-xl hover:bg-bayc-gold transition-colors disabled:opacity-50"
                >
                  {orderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </form>

              {orderError && <p className="text-[10px] text-red-500 font-bold uppercase">{orderError}</p>}
              {order && (
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-bayc-text/30 uppercase">{order.nftName}</span>
                    <span className="text-[10px] font-mono text-bayc-gold">{order.price} ETH</span>
                  </div>
                  {order.flag && (
                    <div className="p-3 bg-bayc-gold/5 border border-bayc-gold/10 rounded-xl">
                      <p className="text-[9px] font-bold text-bayc-gold uppercase mb-1">Decrypted Flag</p>
                      <p className="text-xs font-mono font-bold break-all">{order.flag}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* User Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-bayc-text/30 flex items-center gap-2">
                <Users className="w-3 h-3" /> Archive Index
              </h3>
              <form onSubmit={handleUserLookup} className="relative">
                <input
                  type="text"
                  placeholder="User ID (e.g. 1)"
                  value={lookupUserId}
                  onChange={(e) => setLookupUserId(e.target.value)}
                  className="w-full bg-bayc-cream/50 border-none rounded-2xl p-4 text-sm font-mono text-bayc-text placeholder:text-bayc-text/20 outline-none focus:ring-2 focus:ring-bayc-gold/20"
                />
                <button 
                  type="submit"
                  disabled={userLoading}
                  className="absolute right-2 top-2 p-2 bg-bayc-text text-white rounded-xl hover:bg-bayc-gold transition-colors disabled:opacity-50"
                >
                  {userLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </form>

              {userError && <p className="text-[10px] text-red-500 font-bold uppercase">{userError}</p>}
              {lookedUpUser && (
                <div className="pt-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-bayc-gold/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-bayc-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-bayc-text">{lookedUpUser.username}</p>
                    <p className="text-[10px] text-bayc-text/30 font-mono uppercase">{lookedUpUser.role}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
