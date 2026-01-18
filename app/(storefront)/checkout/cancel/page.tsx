'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">Cancelled</h1>
                    <p className="text-gray-500">The checkout process was cancelled. No charges were made.</p>
                </div>

                <div className="pt-8">
                    <Link
                        href="/"
                        className="block w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] py-4 rounded-xl transition-all hover:bg-gray-900 active:scale-[0.98]"
                    >
                        Return to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
