import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserData } from '../App.tsx';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Auth({ setUser }: { setUser: (u: UserData) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    archiveSignature: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        navigate('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Protocol connection timeout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-card p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <Shield className="w-12 h-12 text-brand mx-auto mb-4" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter">
            Agent <span className="text-brand">{isLogin ? 'Login' : 'Registration'}</span>
          </h2>
          <p className="font-mono text-xs text-gray-500 uppercase italic">Security Clearance Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-gray-400">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/40 border border-border p-3 focus:border-brand outline-none transition-colors font-mono"
              placeholder="operator_name"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase text-gray-400">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-black/40 border border-border p-3 focus:border-brand outline-none transition-colors font-mono"
                placeholder="agent@archive.proto"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-1 relative">
            <label className="font-mono text-[10px] uppercase text-gray-400">Security Key</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-black/40 border border-border p-3 pr-12 focus:border-brand outline-none transition-colors font-mono"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase text-gray-400">Archive Signature</label>
              <input 
                type="text" 
                required
                className="w-full bg-black/40 border border-border p-3 focus:border-brand outline-none transition-colors font-mono"
                placeholder="SIG_00X..."
                value={formData.archiveSignature}
                onChange={(e) => setFormData({...formData, archiveSignature: e.target.value})}
              />
            </div>
          )}

          {error && <p className="text-red-500 font-mono text-[10px] uppercase text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full brutal-btn py-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Initiate Session' : 'Create Agent Profile')}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            {isLogin ? 'Register New Operator Instance' : 'Return to Login Terminal'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
