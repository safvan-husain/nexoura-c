import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth.utils';
import { UserMenu } from './UserMenu';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-transparent">
      <div className="inline-flex mx-auto justify-center h-16 items-center bg-black/10 backdrop-blur-sm">
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
