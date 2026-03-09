import { getOrderById } from '@/lib/order/order.service';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminOrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                <Link href="/admin/orders" className="hover:text-black transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Orders
                </Link>
                <span>/</span>
                <span className="text-black font-medium">#{order.id.slice(-8)}</span>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Order Details</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">ID: {order.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span className="text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 border ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'preorder' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-emerald-500' :
                            order.status === 'pending' ? 'bg-amber-500' :
                            order.status === 'preorder' ? 'bg-blue-500' :
                                'bg-gray-500'
                            }`} />
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border-2 border-gray-100 rounded-[32px] overflow-hidden">
                        <div className="p-8 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Ordered Items ({order.items.length})</h2>
                        </div>
                        <div className="divide-y-2 divide-gray-100">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-8 flex gap-6 group hover:bg-gray-50/50 transition-colors">
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 bg-cover bg-center border border-gray-200 shrink-0"
                                        style={{ backgroundImage: item.productImage ? `url(${item.productImage})` : 'none' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg uppercase tracking-tight truncate">{item.productName}</h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                    Product ID: {item.productId}
                                                </p>
                                                {item.selectedOptions && (
                                                    <div className="flex gap-2 mt-2">
                                                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                            <span key={key} className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                                                {key}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-black tracking-tight">${item.unitPrice.toFixed(2)}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <Link
                                                href={`/products/${item.productSlug}`}
                                                target="_blank"
                                                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1"
                                            >
                                                View on Store
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                            {item.productId && (
                                                <Link
                                                    href={`/admin/products/${item.productId}`}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 flex items-center gap-1"
                                                >
                                                    Edit Product
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-8 border-t-2 border-gray-100">
                            <div className="flex justify-between items-center max-w-xs ml-auto">
                                <span className="font-black uppercase tracking-widest">Total Amount</span>
                                <span className="text-3xl font-black tracking-tight">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Customer & Billing */}
                <div className="space-y-8">
                    {order.billingDetails && (
                        <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Customer Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center font-black text-gray-400">
                                        {order.billingDetails.firstName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-none mb-1">
                                            {order.billingDetails.firstName} {order.billingDetails.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            {order.userId ? 'Registered User' : 'Guest Checkout'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <a href={`mailto:${order.billingDetails.email}`} className="font-medium hover:underline truncate">
                                            {order.billingDetails.email}
                                        </a>
                                    </div>
                                    {order.billingDetails.phone && (
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="font-medium">{order.billingDetails.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="font-medium text-gray-600">
                                            <p>{order.billingDetails.streetAddress}</p>
                                            <p>{order.billingDetails.city}, {order.billingDetails.state} {order.billingDetails.zip}</p>
                                            <p>{order.billingDetails.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {order.stripeSessionId && (
                        <div className="bg-gray-900 rounded-[32px] p-8 text-white">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Payment Info</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                                    <span className="text-sm font-medium text-gray-400">Payment Gateway</span>
                                    <span className="font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Stripe
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Stripe Session ID</span>
                                    <code className="text-xs font-mono text-gray-400 break-all bg-black/50 p-2 rounded block">
                                        {order.stripeSessionId}
                                    </code>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
