import CartClient from '@/components/cart/CartClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your Cart | Nexoura',
    description: 'Review your items and proceed to checkout.',
};

export default function CartPage() {
    return (
        <main className="bg-white pb-20">
            <CartClient />
        </main>
    );
}
