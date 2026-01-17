'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                <div className="flex items-center justify-between p-4 border-b">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
