import { listOrders } from '@/lib/order/order.service';
import Link from 'next/link';

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; status?: string }>;
}) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const status = resolvedParams.status as any;

    const { orders, total } = await listOrders({
        page,
        status,
        limit: 15,
    });

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight">Orders</h1>
                    <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Global order management & fulfillment</p>
                </div>

                <div className="flex gap-2">
                    {['all', 'preorder', 'pending', 'paid', 'completed', 'cancelled'].map((s) => (
                        <Link
                            key={s}
                            href={`/admin/orders${s === 'all' ? '' : `?status=${s}`}`}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${(status === s || (!status && s === 'all'))
                                ? 'bg-black border-black text-white shadow-lg shadow-black/20'
                                : 'border-gray-100 text-gray-400 hover:border-black/10'
                                }`}
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[32px] border-2 border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b-2 border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order ID</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Items</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Total</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Date</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6 font-mono text-xs text-gray-500 uppercase">#{order.id.slice(-8)}</td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm uppercase">{order.billingDetails?.firstName} {order.billingDetails?.lastName}</span>
                                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">{order.billingDetails?.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                        order.status === 'preorder' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                            'bg-gray-100 text-gray-800'
                                        } border`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-bold text-gray-600">{order.items.length} items</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-lg font-black tracking-tight">${order.totalAmount.toFixed(2)}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">No orders found</p>
                    </div>
                )}
            </div>

            {/* Pagination placeholder */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-4 pt-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/admin/orders?page=${i + 1}${status ? `&status=${status}` : ''}`}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${page === i + 1 ? 'bg-black text-white shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-black/20'
                                }`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
