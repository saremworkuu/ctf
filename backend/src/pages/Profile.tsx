import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Shield, Key, Calendar, AlertCircle } from 'lucide-react';
import { UserData } from '../App.tsx';

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  role: string;
  archiveSignature: string;
  createdAt: string;
}

export default function Profile({ user }: { user: UserData | null }) {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    fetch(`/api/users/${id}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or Profile Not Found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, user]);

  if (!user) return <div className="text-center py-24 uppercase font-mono">Access Denied</div>;
  if (loading) return <div className="text-center py-24 font-mono animate-pulse">EXTRACTING_AGENT_DOSSIER...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <AnimatePresence>
        {error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brutal-border p-12 text-center bg-red-950/20 border-red-500/50 space-y-4"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-red-500">Access Restricted</h2>
            <p className="font-mono text-sm text-gray-400">{error}</p>
            <Link to="/" className="brutal-btn inline-block bg-white text-black text-xs">Return to Base</Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutal-card overflow-hidden"
          >
            <div className="h-32 bg-brand/10 border-b border-border relative">
              <div className="absolute -bottom-12 left-8 brutal-border bg-dark p-2">
                <div className="w-24 h-24 bg-brand/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-brand" />
                </div>
              </div>
              <div className="absolute bottom-4 right-8 px-3 py-1 bg-brand text-black font-mono text-[10px] font-bold uppercase">
                {profile?.role}
              </div>
            </div>

            <div className="pt-16 p-8 space-y-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold uppercase tracking-tighter">{profile?.username}</h2>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">PROTOCOL_ID: {profile?.userId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="brutal-border p-4 bg-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-gray-400">
                    <Shield className="w-3 h-3" /> Communication
                  </div>
                  <p className="font-mono text-sm">{profile?.email}</p>
                </div>
                
                <div className="brutal-border p-4 bg-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-gray-400">
                    <Shield className="w-3 h-3" /> Archive Signature
                  </div>
                  <p className="font-mono text-sm break-all">{profile?.archiveSignature}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-gray-500">
                <Calendar className="w-3 h-3" /> Operational Since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </div>

              {user.userId === profile?.userId && (
                <div className="pt-8 border-t border-border">
                  <h3 className="font-bold uppercase tracking-tight text-sm mb-4">Security Notice</h3>
                  <div className="p-4 bg-blue-900/10 border border-blue-500/30 font-mono text-[10px] text-blue-400 leading-relaxed uppercase">
                    Your profile is uniquely identified by the PROTOCOL_ID. 
                    Ensure your access token is never leaked to unauthorized agents.
                    Current ID: <span className="text-blue-200">{profile?.userId}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
