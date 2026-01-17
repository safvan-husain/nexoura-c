import WishlistClient from '@/components/wishlist/WishlistClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your Wishlist | Nexoura',
    description: 'View and manage your saved products.',
};

export default function WishlistPage() {
    return (
        <main className="bg-white pb-20">
            <WishlistClient />
        </main>
    );
}
