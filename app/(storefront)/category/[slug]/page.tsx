import { Suspense } from 'react';
import { getProducts } from '@/lib/api/products';
import { getTagBySlug } from '@/lib/tag/tag.service';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
    return (
        <div className="min-h-screen bg-white">
            <Suspense fallback={<CategoryLoading />}>
                <CategoryContent params={params} />
            </Suspense>
        </div>
    );
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let title = 'Our Collection';
    let description = 'Browse our full range of premium products.';

    if (slug !== 'all') {
        try {
            const tag = await getTagBySlug(slug);
            title = tag.name;
            description = tag.description || `Products in ${tag.name} category.`;
        } catch (error) {
            title = 'Category Not Found';
        }
    }

    const { products } = await getProducts({
        tag: slug,
        status: 'published',
        limit: 100,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">
                    {title}
                </h1>
                <p className="text-gray-500 mt-4 font-medium uppercase tracking-widest text-sm max-w-2xl">
                    {description}
                </p>
                <p className="text-black font-bold mt-2 uppercase tracking-[0.2em] text-xs">
                    {products.length} Products Found
                </p>
            </div>

            {products.length === 0 ? (
                <div className="py-24 text-center border-t border-gray-100">
                    <p className="text-gray-400 uppercase tracking-widest font-medium">No products available in this category.</p>
                    <Link href="/category/all" className="mt-8 inline-block text-black font-black uppercase border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                        View All Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product: any) => (
                        <Link
                            key={product._id.toString()}
                            href={`/?productId=${product._id}`}
                            className="group flex flex-col"
                        >
                            <div className="aspect-[4/5] relative bg-[#f5f5f5] rounded-[2.5rem] overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/5">
                                <Image
                                    src={product.images[0]?.url || ''}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="flex flex-col gap-1 px-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-xl font-bold uppercase leading-tight group-hover:text-gray-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xl font-black text-black">
                                        ${product.price}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                                    {product.shortDescription || 'Nexoura Premium'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Footer decoration */}
            <div className="mt-32 pt-12 border-t border-gray-100 flex flex-col items-center gap-6 text-center">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.3em]">Nexoura Premium Collection</p>
            </div>
        </div>
    );
}

function CategoryLoading() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
            <div className="h-16 bg-gray-100 w-2/3 mb-4 rounded-lg"></div>
            <div className="h-4 bg-gray-100 w-1/3 mb-16 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem]"></div>
                        <div className="h-6 bg-gray-100 w-3/4 rounded-lg"></div>
                        <div className="h-4 bg-gray-100 w-1/4 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
