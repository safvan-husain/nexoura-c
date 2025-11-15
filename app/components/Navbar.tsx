import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth.utils';
import { UserMenu } from './UserMenu';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Nexoura
            </Link>
            <div className="flex gap-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
            </div>
          </div>
          
          <div>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link 
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
