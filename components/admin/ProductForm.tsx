
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { CreateProductSchema, type CreateProductInput } from '@/lib/product/product.schema';
import { createProductAction, updateProductAction } from '@/lib/actions/product.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Loader2, X, Upload, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
    initialData?: any; // Replace with proper type from database
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [tempColor, setTempColor] = useState('');
    const [tempSize, setTempSize] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('/api/tags');
                const data = await res.json();
                if (res.ok) setAvailableTags(data);
            } catch (err) {
                console.error('Failed to fetch tags:', err);
            }
        };
        fetchTags();
    }, []);

    // Default values need to be carefully handled for editing vs creating


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateProductInput>({
        resolver: zodResolver(CreateProductSchema) as any,
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            price: 0,
            stock: 0,
            status: 'draft',
            images: [],
            tags: [],
            hasColors: false,
            colors: [],
            hasSizes: false,
            sizes: [],
            ...initialData // Override with initial data if present
        },
    });

    const images = watch('images') || [];
    const selectedTags = watch('tags') || [];
    const hasColors = watch('hasColors');
    const colors = watch('colors') || [];
    const hasSizes = watch('hasSizes');
    const sizes = watch('sizes') || [];

    const toggleTag = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setValue('tags', selectedTags.filter(id => id !== tagId));
        } else {
            setValue('tags', [...selectedTags, tagId]);
        }
    };

    const addColor = () => {
        if (tempColor.trim() && !colors.includes(tempColor.trim())) {
            setValue('colors', [...colors, tempColor.trim()]);
            setTempColor('');
        }
    };

    const removeColor = (colorToRemove: string) => {
        setValue('colors', colors.filter(c => c !== colorToRemove));
    };

    const addSize = () => {
        if (tempSize.trim() && !sizes.includes(tempSize.trim())) {
            setValue('sizes', [...sizes, tempSize.trim()]);
            setTempSize('');
        }
    };

    const removeSize = (sizeToRemove: string) => {
        setValue('sizes', sizes.filter(s => s !== sizeToRemove));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to upload image');
            }

            // Add new image to the list
            const newImage = {
                url: data.url,
                isPrimary: images.length === 0, // First image is primary by default
            };

            setValue('images', [...images, newImage]);
        } catch (err: any) {
            console.error("Upload error:", err);
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
            // Reset input value to allow uploading same file again if needed
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setValue('images', images.filter((_, index) => index !== indexToRemove));
    };

    const setPrimaryImage = (indexToSet: number) => {
        const updatedImages = images.map((img, index) => ({
            ...img,
            isPrimary: index === indexToSet,
        }));
        setValue('images', updatedImages);
    };

    const onSubmit: SubmitHandler<CreateProductInput> = async (data) => {
        setIsSubmitting(true);
        console.log('[ProductForm] Submitting with data:', JSON.stringify(data, null, 2));
        try {
            const formData = new FormData();
            // Flatten the data into FormData as expected by the server action
            // Note: usage of formData in server action seems to expect individual fields
            // or a way to construct the object.
            // Looking at product.actions.ts:
            // const productData = {
            //   name: formData.get('name'),
            //   ...
            //   images: JSON.parse(formData.get('images') as string || '[]'),
            // }

            formData.append('name', data.name);
            formData.append('slug', data.slug);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());
            if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
            formData.append('stock', data.stock.toString());
            formData.append('status', data.status);
            formData.append('images', JSON.stringify(data.images));
            formData.append('tags', JSON.stringify(data.tags));
            formData.append('hasColors', data.hasColors.toString());
            formData.append('colors', JSON.stringify(data.colors));
            formData.append('hasSizes', data.hasSizes.toString());
            formData.append('sizes', JSON.stringify(data.sizes));

            console.log('[ProductForm] FormData overview:');
            formData.forEach((value, key) => console.log(`  ${key}: ${value}`));


            if (isEditing && initialData?._id) {
                const res = await updateProductAction(initialData._id, formData);
                if (res.error) {
                    alert(res.error); // Simple alert for now, toast would be better
                } else {
                    router.push('/admin/products');
                }
            } else {
                const res = await createProductAction(formData);
                if (res.error) {
                    alert(res.error);
                } else {
                    router.push('/admin/products');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <Input {...register('name')} placeholder="e.g. Premium T-Shirt" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug</label>
                            <Input {...register('slug')} placeholder="e.g. premium-t-shirt" />
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea {...register('description')} placeholder="Product description..." rows={5} />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Short Description (Optional)</label>
                        <Textarea {...register('shortDescription')} placeholder="Brief summary..." rows={2} />
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pricing & Inventory</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stock</label>
                        <Input
                            type="number"
                            {...register('stock', { valueAsNumber: true })}
                        />
                        {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select {...register('status')}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags / Categories</label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px] bg-slate-50">
                            {availableTags.length === 0 ? (
                                <p className="text-xs text-slate-400">No tags available. Create them in the Tags menu.</p>
                            ) : (
                                availableTags.map((tag) => (
                                    <button
                                        key={tag._id}
                                        type="button"
                                        onClick={() => toggleTag(tag._id)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedTags.includes(tag._id)
                                            ? 'bg-black text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))
                            )}
                        </div>
                        {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product Images</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="image-upload"
                            className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
                        >
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            ) : (
                                <Upload className="h-8 w-8 text-slate-400" />
                            )}
                            <span className="text-sm text-slate-500">
                                {isUploading ? 'Uploading & Removing Background...' : 'Click to upload image'}
                            </span>
                            <span className="text-xs text-slate-400">Supports JPG, PNG, WebP</span>
                        </label>
                    </div>
                    {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                <Image
                                    src={img.url}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPrimaryImage(index)}
                                        className={`text-xs px-2 py-1 rounded ${img.isPrimary ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-slate-200'}`}
                                    >
                                        {img.isPrimary ? 'Primary' : 'Set Primary'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                {img.isPrimary && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded shadow-sm">
                                        Primary
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
                </div>

                {/* Variants Selection */}
                <div className="md:col-span-2 space-y-6 pt-4 border-t">
                    <h3 className="text-lg font-medium">Product Variants</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Colors */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Color Selection</label>
                                <Switch
                                    checked={hasColors}
                                    onChange={(e) => setValue('hasColors', e.target.checked)}
                                    label={hasColors ? "Enabled" : "Disabled"}
                                />
                            </div>

                            {hasColors && (
                                <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                value={tempColor}
                                                onChange={(e) => setTempColor(e.target.value)}
                                                placeholder="Color name or Hex (#000)"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                            />
                                        </div>
                                        <Button type="button" onClick={addColor} variant="secondary" size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {colors.map((color) => (
                                            <div
                                                key={color}
                                                className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-full shadow-sm"
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full border border-slate-200"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-xs font-medium">{color}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeColor(color)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {colors.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center py-2">No colors added yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sizes */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Size Selection</label>
                                <Switch
                                    checked={hasSizes}
                                    onChange={(e) => setValue('hasSizes', e.target.checked)}
                                    label={hasSizes ? "Enabled" : "Disabled"}
                                />
                            </div>

                            {hasSizes && (
                                <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                value={tempSize}
                                                onChange={(e) => setTempSize(e.target.value)}
                                                placeholder="e.g. S, M, L, XL or 42, 44"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                            />
                                        </div>
                                        <Button type="button" onClick={addSize} variant="secondary" size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {sizes.map((size) => (
                                            <div
                                                key={size}
                                                className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-full shadow-sm"
                                            >
                                                <span className="text-xs font-medium uppercase">{size}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSize(size)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {sizes.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center py-2">No sizes added yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
