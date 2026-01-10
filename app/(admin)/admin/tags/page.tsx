'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTagSchema, type CreateTagInput } from '@/lib/tag/tag.schema';

interface Tag {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<CreateTagInput>({
        resolver: zodResolver(CreateTagSchema)
    });

    const fetchTags = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/tags');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch tags');
            setTags(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (editingTag) {
            setValue('name', editingTag.name);
            setValue('slug', editingTag.slug);
            setValue('description', editingTag.description || '');
        } else {
            reset({ name: '', slug: '', description: '' });
        }
    }, [editingTag, setValue, reset]);

    const onSubmit = async (data: CreateTagInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const url = editingTag ? `/api/tags/${editingTag._id}` : '/api/tags';
            const method = editingTag ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to save tag');

            await fetchTags();
            setEditingTag(null);
            reset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to delete tag');
            await fetchTags();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const generateSlug = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setValue('slug', slug, { shouldValidate: true });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Tags / Categories</h2>
                <p className="text-slate-500">
                    Create and manage tags for your products.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingTag ? 'Edit Tag' : 'Create New Tag'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    {...register('name')}
                                    placeholder="e.g. New Arrivals"
                                    onChange={(e) => {
                                        register('name').onChange(e);
                                        if (!editingTag) generateSlug(e.target.value);
                                    }}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <Input {...register('slug')} placeholder="e.g. new-arrivals" />
                                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <Textarea {...register('description')} placeholder="Brief description..." rows={3} />
                            </div>

                            {error && <p className="text-sm text-red-500 py-2">{error}</p>}

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingTag ? 'Update' : 'Create'}
                                </Button>
                                {editingTag && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setEditingTag(null)}
                                        disabled={isSubmitting}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="md:col-span-2">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : tags.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border border-dashed text-center">
                            <p className="text-slate-500">No tags found. Create your first tag to get started.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
                                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tags.map((tag) => (
                                        <tr key={tag._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{tag.name}</div>
                                                {tag.description && <div className="text-sm text-slate-400 truncate max-w-xs">{tag.description}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                <code>{tag.slug}</code>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingTag(tag)}
                                                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tag._id)}
                                                        className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-slate-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
