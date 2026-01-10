import { Navbar } from "@/components/layout/Navbar";
import { Suspense } from "react";

export default function StorefrontLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
            </Suspense>
            {children}
        </>
    );
}

function NavbarSkeleton() {
    return (
        <nav className="bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <div className="text-2xl font-bold text-blue-600">Nexoura</div>
                        <div className="flex gap-6">
                            <div className="text-gray-700">Home</div>
                            <div className="text-gray-700">Products</div>
                        </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
            </div>
        </nav>
    );
}
