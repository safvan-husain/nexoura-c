export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Nexoura</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your modern e-commerce platform
          </p>
          
          <div className="flex gap-4 justify-center">
            <a
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </a>
            <a
              href="/admin/login"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Fast & Modern</h3>
            <p className="text-gray-600">
              Built with Next.js 16 and Cache Components for optimal performance
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">
              JWT authentication with secure cookie-based sessions
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Scalable</h3>
            <p className="text-gray-600">
              MongoDB backend with clean architecture and separation of concerns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
