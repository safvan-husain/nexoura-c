'use client';

import { useState } from 'react';
import { BillingDetails, BillingDetailsSchema } from '@/lib/order/billing-details.schema';

interface BillingDetailsFormProps {
    initialData?: Partial<BillingDetails>;
    onSubmit: (data: BillingDetails) => void;
    isLoading?: boolean;
}

export default function BillingDetailsForm({ initialData, onSubmit, isLoading }: BillingDetailsFormProps) {
    const [formData, setFormData] = useState<Partial<BillingDetails>>({
        email: initialData?.email || '',
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        country: initialData?.country || 'United States',
        streetAddress: initialData?.streetAddress || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        phone: initialData?.phone || '',
        zip: initialData?.zip || '',
        orderNotes: initialData?.orderNotes || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof BillingDetails, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof BillingDetails]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = BillingDetailsSchema.parse(formData);
            onSubmit(validatedData);
        } catch (err: any) {
            if (err.issues) {
                const newErrors: any = {};
                err.issues.forEach((issue: any) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border-2 ${errors.firstName ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                        placeholder="John"
                        disabled={isLoading}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border-2 ${errors.lastName ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                        placeholder="Doe"
                        disabled={isLoading}
                    />
                    {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.lastName}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-gray-50 border-2 ${errors.email ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                    placeholder="john@example.com"
                    disabled={isLoading}
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-gray-50 border-2 ${errors.phone ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                    placeholder="+1 (555) 000-0000"
                    disabled={isLoading}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Country</label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full bg-gray-50 border-2 ${errors.country ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all text-sm appearance-none cursor-pointer`}
                    disabled={isLoading}
                >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Street Address</label>
                <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`w-full bg-gray-50 border-2 ${errors.streetAddress ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                    placeholder="123 Street Ave"
                    disabled={isLoading}
                />
                {errors.streetAddress && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.streetAddress}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border-2 ${errors.city ? 'border-red-500' : 'border-transparent'} focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm`}
                        placeholder="New York"
                        disabled={isLoading}
                    />
                    {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">State / Province</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm"
                        placeholder="NY"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Zip / Postal Code</label>
                <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm"
                    placeholder="10001"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Order Notes (Optional)</label>
                <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 text-sm min-h-[100px] resize-none"
                    placeholder="Any special instructions for your order..."
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-xl transition-all hover:bg-gray-900 active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center gap-2`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wait...
                    </>
                ) : 'Confirm and Checkout'}
            </button>
        </form>
    );
}
