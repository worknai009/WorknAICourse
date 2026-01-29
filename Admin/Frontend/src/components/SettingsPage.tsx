import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Lock, Mail, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/settings/profile`);
      setProfile({ name: res.data.name, email: res.data.email });
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const data: any = { name: profile.name, email: profile.email };
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        data.newPassword = passwords.newPassword;
      }

      await api.put(`/settings/update-profile`, data);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Security & Account</h2>
        <p className="text-gray-400 mt-1 text-sm">Manage your administrative credentials and profile information.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <User size={20} />
                </div>
                <h3 className="font-bold text-lg">Profile Information</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <User size={12} /> Display Name
                    </label>
                    <input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="Admin Username"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <Mail size={12} /> Email Address
                    </label>
                    <input 
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="admin@worknai.com"
                        required
                    />
                </div>
            </div>
        </div>

        {/* Password Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Lock size={20} />
                </div>
                <h3 className="font-bold text-lg">Update Password</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                       <Shield size={12} /> New Password
                    </label>
                    <input 
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="••••••••"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                        <Shield size={12} /> Confirm Password
                    </label>
                    <input 
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="••••••••"
                    />
                </div>
                <div className="col-span-full">
                    <p className="text-xs text-gray-500 italic">Leave password fields blank if you don't want to change it.</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
                {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
