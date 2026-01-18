'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative mx-auto w-24 h-24 bg-black rounded-full flex items-center justify-center text-white shadow-2xl">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="absolute inset-0 rounded-full animate-ping bg-black/20" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-tight">Thank You!</h1>
                    <p className="text-gray-500">Your order has been placed successfully. A confirmation email will be sent shortly.</p>
                </div>

                <div className="pt-8 space-y-4">
                    <Link
                        href="/account/orders"
                        className="block w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] py-4 rounded-xl transition-all hover:bg-gray-900 active:scale-[0.98]"
                    >
                        View My Orders
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-50 text-black text-[10px] font-bold uppercase tracking-[0.4em] py-4 rounded-xl transition-all hover:bg-gray-100 active:scale-[0.98]"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
