import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SettingsService } from "@/lib/settings/settings.service";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";

async function AdminThemeLoader({ children }: { children: React.ReactNode }) {
    await connection();
    const adminTheme = await SettingsService.getAdminTheme();

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme={adminTheme}
            enableSystem={false}
            storageKey="nexoura-admin-theme"
        >
            <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
                <header className="bg-slate-900 text-white p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-xl font-bold">Nexoura Admin</h1>
                        <nav className="flex items-center gap-6">
                            <ul className="flex gap-4">
                                <li><Link href="/admin" className="hover:text-slate-300">Dashboard</Link></li>
                                <li><Link href="/admin/products" className="hover:text-slate-300">Products</Link></li>
                                <li><Link href="/admin/tags" className="hover:text-slate-300">Tags</Link></li>
                                <li className="hover:text-slate-300 cursor-pointer text-slate-500">Orders</li>
                            </ul>
                            <div className="border-l border-slate-700 h-6 mx-2" />
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <AdminThemeLoader>
                {children}
            </AdminThemeLoader>
        </Suspense>
    );
}
