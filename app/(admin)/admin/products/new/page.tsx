
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Product</h2>
                <p className="text-slate-500">
                    Add a new product to your catalog.
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
