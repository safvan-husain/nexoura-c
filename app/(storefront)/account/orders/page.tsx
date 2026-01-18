import { getStorefrontSession } from '@/lib/storefront-session/storefront-session.service';
import { listOrders } from '@/lib/order/order.service';
import Link from 'next/link';

export default async function UserOrdersPage() {
    const session = await getStorefrontSession();

    if (!session) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Account Required</h1>
                <p className="text-gray-500 mb-8">Please log in to view your order history.</p>
                <Link href="/account/login" className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] px-8 py-4 rounded-xl">
                    Log In
                </Link>
            </div>
        );
    }

    const { orders } = await listOrders({
        sessionId: session.sessionId,
        userId: session.userId
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <header className="mb-12">
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">My Orders</h1>
                <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">Track your premium nexoura pieces</p>
            </header>

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mb-8">No orders found yet</p>
                    <Link href="/" className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 rounded-xl transition-all hover:bg-gray-900">
                        Explore Collection
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border-2 border-gray-100 rounded-3xl p-8 transition-all hover:border-black/10 hover:shadow-xl group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-100 bg-cover bg-center" style={{ backgroundImage: item.productImage ? `url(${item.productImage})` : 'none' }} />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white tracking-widest">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg uppercase tracking-tight line-clamp-1">
                                                {order.items.map(item => item.productName).join(', ')}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} · ID: {order.id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 pr-4">
                                    <span className="text-3xl font-black tracking-tight">${order.totalAmount.toFixed(2)}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Total Amount</span>
                                </div>

                                <Link href={`/account/orders/${order.id}`} className="md:border-l border-gray-100 md:pl-8 flex items-center">
                                    <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center transition-all group-hover:scale-110 active:scale-95">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
