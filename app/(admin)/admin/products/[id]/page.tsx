
import { getProductById } from '@/lib/product/product.service';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    try {
        const product = await getProductById(id);

        // Serialize product for client component
        const serializedProduct = {
            ...product,
            _id: product._id.toString(),
            images: product.images?.map((img: any) => ({
                ...img,
                _id: img._id?.toString(),
            })) || [],
        };

        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
                    <p className="text-slate-500">
                        Update product details and images.
                    </p>
                </div>

                <ProductForm initialData={serializedProduct} isEditing />
            </div>
        );
    } catch (error) {
        notFound();
    }
}
