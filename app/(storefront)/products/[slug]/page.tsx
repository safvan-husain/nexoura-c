
import { getProductBySlug } from '@/lib/product/product.service'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug).catch(() => null)

    if (!product) {
        notFound()
    }

    // Calculate discount if applicable
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

    return (
        <div className="h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Store
                </Link>

                <div className="flex flex-col lg:flex-row lg:justify-center gap-12 lg:gap-20">
                    {/* Left Side - Image */}
                    <div className="w-full lg:w-1/3">
                        <div className="relative aspect-[4/5] bg-[#f8f8f8] rounded-[2rem] overflow-hidden">
                            <Image
                                src={product.images[0]?.url || ''}
                                alt={product.images[0]?.alt || product.name}
                                fill
                                className="object-contain p-8 hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>

                        {/* Minimal Gallery Preview if multiple images exist */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {product.images.slice(0, 4).map((img: any, idx: number) => (
                                    <div key={idx} className="relative aspect-square bg-[#f8f8f8] rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-black">
                                        <Image
                                            src={img.url}
                                            alt={img.alt || ''}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-2/3 flex flex-col pt-4 lg:pt-12">
                        <div className="mb-8">
                            {product.tags && product.tags.length > 0 && (
                                <span className="inline-block px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                    New Arrival
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-[0.9] mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-medium text-black">
                                    ${product.price}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-gray-400 line-through decoration-1">
                                        ${product.compareAtPrice}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-500 mb-10 leading-relaxed max-w-none">
                            <p>{product.description}</p>
                        </div>

                        <div className="mt-auto space-y-4">
                            {/* Stock Check */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
                                    Add to Cart
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-100 rounded-2xl hover:border-black transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
