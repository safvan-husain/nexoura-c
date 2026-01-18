import { getStorefrontSession } from '@/lib/storefront-session/storefront-session.service';
import { getOrderById } from '@/lib/order/order.service';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getStorefrontSession();
    if (!session) {
        redirect('/account/login');
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    // Ensure user owns the order
    if (order.userId !== session.userId && order.sessionId !== session.sessionId) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="mb-12">
                <Link href="/account/orders" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Order #{order.id.slice(-8)}</h1>
                        <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden p-8">
                        <h2 className="text-sm font-black uppercase tracking-widest mb-8">Order Items</h2>
                        <div className="space-y-8">
                            {order.items.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.productSlug ? `/products/${item.productSlug}` : '#'}
                                    className={`flex gap-6 group ${!item.productSlug && 'pointer-events-none'}`}
                                >
                                    <div className="w-24 h-24 rounded-2xl bg-gray-100 bg-cover bg-center border-2 border-transparent group-hover:border-black/10 transition-all shrink-0"
                                        style={{ backgroundImage: item.productImage ? `url(${item.productImage})` : 'none' }}
                                    />
                                    <div className="flex-1 py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                                                    {item.productName}
                                                </h3>
                                                {item.selectedOptions && (
                                                    <div className="flex gap-2 mt-1">
                                                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                            <span key={key} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                                                {key}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black tracking-tight">${item.unitPrice.toFixed(2)}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        {item.currentPrice && item.currentPrice !== item.unitPrice && (
                                            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                                                Current Price: ${item.currentPrice.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-3xl p-8">
                        <h2 className="text-sm font-black uppercase tracking-widest mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-500">Subtotal</span>
                                <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-500">Shipping</span>
                                <span className="font-bold text-emerald-600">Free</span>
                            </div>
                            <div className="pt-4 mt-4 border-t-2 border-gray-200 flex justify-between items-center">
                                <span className="font-black uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-black tracking-tight">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {order.billingDetails && (
                        <div className="border-2 border-gray-100 rounded-3xl p-8">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6">Billing Details</h2>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-bold text-black">{order.billingDetails.firstName} {order.billingDetails.lastName}</p>
                                <p>{order.billingDetails.email}</p>
                                <p>{order.billingDetails.phone}</p>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <p>{order.billingDetails.streetAddress}</p>
                                    <p>{order.billingDetails.city}, {order.billingDetails.state} {order.billingDetails.zip}</p>
                                    <p>{order.billingDetails.country}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
