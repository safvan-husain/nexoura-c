
import { connection } from 'next/server';
import { getProducts } from '@/lib/product/product.service';

import ProductList from '@/components/admin/ProductList';


export default async function ProductsPage() {
    await connection();
    // Fetch all products with increased limit for now
    const { products } = await getProducts({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    // Serialize products to ensure IDs are strings
    const serializedProducts = products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        images: product.images?.map((img: any) => ({
            ...img,
            _id: img._id?.toString(),
        })) || [],
    }));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                <p className="text-slate-500">
                    Manage your product catalog, prices, and inventory.
                </p>
            </div>

            <ProductList initialProducts={serializedProducts} />
        </div>
    );
}
