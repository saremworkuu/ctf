import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, User, Key, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [archiveSignature, setArchiveSignature] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hint, setHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function resetForm() {
    setUsername('');
    setEmail('');
    setPassword('');
    setArchiveSignature('');
    setError('');
    setSuccess('');
    setHint('');
    setShowPassword(false);
  }

  function switchMode() {
    setIsLogin(!isLogin);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setHint('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        navigate('/gallery');
      } else {
        await register(username, email, password, archiveSignature);
        setSuccess('Identity initialized!');
        setTimeout(() => navigate('/gallery'), 500);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-bayc-cream">
      {/* Left Side - Image */}
      <div className="w-1/2 relative hidden md:block">
        <img
          src="https://i.pinimg.com/736x/fc/a3/d1/fca3d13cf1ea5a2ea3504bd7402577a5.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-12">
          <p className="text-white/60 text-[10px] uppercase tracking-[0.4em] font-bold font-mono">
            AUTHENTICATED_ARCHIVE_PROTOCOL
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-12">
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-none p-12 border border-bayc-text/5 space-y-10"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bayc-gold/10 mb-2">
              <Shield className="w-6 h-6 text-bayc-gold" />
            </div>
            <h1 className="text-4xl font-display font-bold text-bayc-text uppercase tracking-tight">
              {isLogin ? 'Log In' : 'Sign Up'}
            </h1>
            <p className="text-bayc-text/40 text-[10px] uppercase font-bold tracking-[0.2em]">
              {isLogin ? 'Enter the archive protocol' : 'Become a verified member'}
            </p>
          </div>

          {/* Alert: error or success */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-600 font-medium">{success}</p>
            </motion.div>
          )}
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-bayc-gold/10 border border-bayc-gold/30 rounded-lg space-y-1"
            >
              <p className="text-[9px] font-bold uppercase tracking-widest text-bayc-gold">
                🔍 Archive Hint
              </p>
              <p className="text-xs font-mono text-bayc-text/70">{hint}</p>
            </motion.div>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Username — always shown */}
              <div className="relative group border-b border-bayc-text/10 focus-within:border-bayc-gold transition-colors">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-bayc-text/30 group-focus-within:text-bayc-gold transition-colors" />
                <input
                  id="auth-username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent py-4 pl-8 pr-4 text-bayc-text text-sm outline-none placeholder:text-bayc-text/20 font-mono"
                />
              </div>

              {/* Email — register only */}
              {!isLogin && (
                <div className="relative group border-b border-bayc-text/10 focus-within:border-bayc-gold transition-colors">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-bayc-text/30 group-focus-within:text-bayc-gold transition-colors" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent py-4 pl-8 pr-4 text-bayc-text text-sm outline-none placeholder:text-bayc-text/20 font-mono"
                  />
                </div>
              )}

              {/* Password */}
              <div className="relative group border-b border-bayc-text/10 focus-within:border-bayc-gold transition-colors">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-bayc-text/30 group-focus-within:text-bayc-gold transition-colors" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent py-4 pl-8 pr-12 text-bayc-text text-sm outline-none placeholder:text-bayc-text/20 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-bayc-text/30 hover:text-bayc-gold transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Archive Signature — register only */}
              {!isLogin && (
                <div className="relative group border-b border-bayc-text/10 focus-within:border-bayc-gold transition-colors">
                  <Key className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-bayc-text/30 group-focus-within:text-bayc-gold transition-colors" />
                  <input
                    id="auth-signature"
                    type="text"
                    placeholder="Archive Signature (optional)"
                    value={archiveSignature}
                    onChange={(e) => setArchiveSignature(e.target.value)}
                    className="w-full bg-transparent py-4 pl-8 pr-4 text-bayc-text text-sm outline-none placeholder:text-bayc-text/20 font-mono"
                  />
                </div>
              )}
            </div>

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full relative py-5 bg-bayc-text text-white font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-bayc-gold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Processing...'
                : isLogin
                ? 'Log In'
                : 'Initialize Identity'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="text-center pt-6 border-t border-bayc-text/5">
            <button
              onClick={switchMode}
              className="text-[10px] uppercase font-bold tracking-widest text-bayc-text/40 hover:text-bayc-gold transition-colors"
            >
              {isLogin
                ? 'Need a vault identity? Sign Up'
                : 'Already a member? Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
