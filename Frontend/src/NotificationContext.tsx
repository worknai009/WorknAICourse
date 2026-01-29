import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ConfirmState {
    show: boolean;
    title: string;
    message: string;
    resolve: (value: boolean) => void;
}

interface NotificationContextType {
    showToast: (message: string, type?: ToastType) => void;
    confirm: (title: string, message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const confirm = useCallback((title: string, message: string) => {
        return new Promise<boolean>((resolve) => {
            setConfirmState({ show: true, title, message, resolve });
        });
    }, []);

    const handleConfirmResponse = (response: boolean) => {
        if (confirmState) {
            confirmState.resolve(response);
            setConfirmState(null);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            {children}

            {/* Toasts Container */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                min-w-[300px] p-4 rounded-2xl border backdrop-blur-xl flex items-center gap-4 shadow-2xl relative
                                ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : ''}
                                ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}
                                ${toast.type === 'info' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' : ''}
                            `}>
                                <div className="shrink-0">
                                    {toast.type === 'success' && <CheckCircle size={20} />}
                                    {toast.type === 'error' && <XCircle size={20} />}
                                    {toast.type === 'info' && <Info size={20} />}
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest flex-grow leading-tight">
                                    {toast.message}
                                </p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={14} />
                                </button>

                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: 4, ease: 'linear' }}
                                    className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-30
                                        ${toast.type === 'success' ? 'bg-emerald-500' : ''}
                                        ${toast.type === 'error' ? 'bg-red-500' : ''}
                                        ${toast.type === 'info' ? 'bg-cyan-500' : ''}
                                    `}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Premium Confirm Modal */}
            <AnimatePresence>
                {confirmState && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md p-8 rounded-[3rem] border border-white/10 bg-zinc-900 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <AlertTriangle size={120} />
                            </div>

                            <div className="relative z-10 space-y-6 text-center">
                                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                    <AlertTriangle size={32} className="text-red-500" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold italic tracking-tighter text-white uppercase">{confirmState.title}</h3>
                                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                                        {confirmState.message}
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => handleConfirmResponse(false)}
                                        className="flex-1 py-4 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all"
                                    >
                                        Cancel Request
                                    </button>
                                    <button
                                        onClick={() => handleConfirmResponse(true)}
                                        className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all"
                                    >
                                        Confirm Purge
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
