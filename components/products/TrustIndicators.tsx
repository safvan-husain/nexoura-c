import React from 'react'

export default function TrustIndicators() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Free Shipping */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f0ece8] rounded-xl px-5 py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 0-.879-2.121l-2.246-2.246A2.999 2.999 0 0 0 16.875 9H15.75m-6 0V5.625m0 12.75h-1.5m1.5 0v-3.375m0 0h6.75" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700 sm:hidden">Free Shipping</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-700 hidden sm:block">Free Shipping</p>
                    <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Enjoy free shipping with prepaid orders</p>
                </div>
            </div>

            {/* Best Offers */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f0ece8] rounded-xl px-5 py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700 sm:hidden">Best Offers</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-700 hidden sm:block">Best Offers</p>
                    <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Limited-time best discount deals</p>
                </div>
            </div>

            {/* Trending Styles */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f0ece8] rounded-xl px-5 py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700 sm:hidden">Trending Styles</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-700 hidden sm:block">Trending Styles</p>
                    <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Curated latest fashion trends</p>
                </div>
            </div>

            {/* Cash on Delivery */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f0ece8] rounded-xl px-5 py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700 sm:hidden">Cash on Delivery</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-700 hidden sm:block">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">100% safe &amp; secure shopping</p>
                </div>
            </div>
        </div>
    )
}
