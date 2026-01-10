export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-slate-900 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Nexoura Admin</h1>
                    <nav>
                        <ul className="flex gap-4">
                            <li>Dashboard</li>
                            <li>Products</li>
                            <li>Orders</li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
