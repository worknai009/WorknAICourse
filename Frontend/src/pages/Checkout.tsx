import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme, useData } from '../context';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CreditCard, ShieldCheck, ArrowRight, ChevronLeft, Lock } from 'lucide-react';
import { useNotification } from '../NotificationContext';

const Checkout: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const { courses } = useData();
    const { showToast } = useNotification();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const course = courses.find(c => c.id === id || c._id === id);

    if (!course) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-white text-black'}`}>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Course not found</p>
            </div>
        );
    }

    const gst = Math.round(course.discountedPrice * 0.18);
    const total = course.discountedPrice + gst;

    const handlePayment = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const res = await axios.post(`${baseUrl}/api/user/purchase`, { courseId: course.id || course._id }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/lms/courses'), 2000);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                showToast(err.response?.data?.message || "Payment failed", "error");
            } else {
                showToast("Payment failed", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-white text-black'}`}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8"
                >
                    <ShieldCheck size={48} className="text-emerald-500" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">Payment Confirmed</h1>
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">Welcome to the track. Redirecting to your archive...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-32 pb-24 px-6 md:px-12 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 font-bold text-[10px] uppercase tracking-widest">
                    <ChevronLeft size={16} /> Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Summary */}
                    <div className="space-y-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-5xl font-bold italic tracking-tighter">Finalize Enrollment</h1>
                            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Digital Terminal • Secure Checkout</p>
                        </div>

                        <div className={`p-8 rounded-[3rem] border ${isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5'} relative overflow-hidden group`}>
                            <div className="relative z-10 flex gap-6">
                                <div className="h-24 w-40 rounded-2xl overflow-hidden shrink-0 bg-zinc-800">
                                    <img src={course.certificateImage || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{course.language} • Professional Track</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-4">
                                <span>Tuition Fee</span>
                                <span>₹{course.discountedPrice?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-4 pb-4 border-b border-white/5">
                                <span>Regulatory GST (18%)</span>
                                <span>₹{gst.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 pt-4">
                                <span className="text-xl font-bold">Total Investment</span>
                                <span className="text-3xl font-bold text-cyan-400 italic">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Method Mocks */}
                    <div className="space-y-8">
                        <div className={`p-10 rounded-[4rem] border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-black/10'}`}>
                            <div className="flex items-center gap-3 mb-10">
                                <Lock size={18} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">AES-256 Encrypted Payment Gateway</span>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl border-2 border-cyan-500 bg-cyan-500/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="text-cyan-400" />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest">Card / UPI / Netbanking</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Powered by Razorpay Secure</p>
                                        </div>
                                    </div>
                                    <div className="h-4 w-4 rounded-full border-4 border-cyan-500 bg-black"></div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className={`w-full py-6 rounded-3xl font-bold text-[12px] uppercase tracking-[0.2em] transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 ${isDarkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/10'}`}
                                    >
                                        {loading ? 'Processing Transaction...' : 'Complete Payment'} <ArrowRight size={18} />
                                    </button>
                                    <div className="flex items-center justify-center gap-4 opacity-30 grayscale">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Visa.svg/1200px-Visa.svg.png" className="h-4" alt="" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4" alt="" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-4" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-8 opacity-50">
                            <ShieldCheck size={24} className="text-zinc-500 shrink-0" />
                            <p className="text-[8px] font-bold leading-relaxed text-zinc-600 uppercase tracking-widest">
                                By completing this transaction, you agree to the WorknAI Terms of Service. Purchases are final and granted immediate access to the professional track repository.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
