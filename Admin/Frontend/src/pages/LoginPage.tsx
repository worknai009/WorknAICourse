import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/admin/auth/login', { email, password });
      login(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
        
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                <Shield size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Workn<span className="text-blue-500 text-6xl">AI</span></h1>
          <p className="text-gray-400 font-medium">Administrator Portal Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-shake">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 px-1">
              <Mail size={12} /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700"
              placeholder="admin@worknai.com"
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 px-1">
              <Lock size={12} /> Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="text-center">
            <button 
              onClick={onSwitch}
              className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
            >
              First time here? <span className="text-blue-500 border-b border-blue-500/30 pb-0.5">Register Account</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
