import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';

export const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        message: '',
        title: 'Onay Gerekli',
        confirmText: 'Onayla',
        cancelText: 'İptal',
    });

    const resolver = useRef(null);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            const currentOptions = typeof options === 'string' ? { message: options } : options;
            
            setConfirmState({
                isOpen: true,
                message: currentOptions.message || '',
                title: currentOptions.title || 'Onay Gerekli',
                confirmText: currentOptions.confirmText || 'Onayla',
                cancelText: currentOptions.cancelText || 'İptal'
            });

            resolver.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(true);
    }, []);

    const handleCancel = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(false);
    }, []);

    // Klavyeden Escape ile iptal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && confirmState.isOpen) {
                handleCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmState.isOpen, handleCancel]);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {confirmState.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200"
                        role="dialog" 
                        aria-modal="true"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {confirmState.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                {confirmState.message}
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                {confirmState.cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/30"
                            >
                                {confirmState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
