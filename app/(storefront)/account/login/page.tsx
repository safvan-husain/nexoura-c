import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Nexoura',
    description: 'Sign in to your Nexoura account.',
};

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-[400px] mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                        Enter your details to sign in
                    </p>
                </header>

                <LoginForm />

                <footer className="mt-12 text-center text-sm">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/account/register" className="font-bold text-black hover:underline uppercase tracking-widest text-xs">
                            Create One
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    );
}
