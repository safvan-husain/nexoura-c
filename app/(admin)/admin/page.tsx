export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p>Welcome to the Nexoura Administration Panel.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">Total Sales</h3>
                    <p className="text-2xl font-bold mt-1">$0.00</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">Total Orders</h3>
                    <p className="text-2xl font-bold mt-1">0</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">New Customers</h3>
                    <p className="text-2xl font-bold mt-1">0</p>
                </div>
            </div>
        </div>
    );
}
