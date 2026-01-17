import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | Nexoura',
    description: 'Create your Nexoura account.',
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-[400px] mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">
                        Join Nexoura
                    </h1>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                        Create an account to save your favorites
                    </p>
                </header>

                <RegisterForm />

                <footer className="mt-12 text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link href="/account/login" className="font-bold text-black hover:underline uppercase tracking-widest text-xs">
                            Sign In
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    );
}
