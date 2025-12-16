import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth.utils';
import { UserMenu } from './UserMenu';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-transparent">
      <div className="flex mx-auto justify-center h-16 items-center backdrop-blur-sm">
        <div className="flex max-w-7xl w-full px-4 sm:px-6 lg:px-8 items-center justify-center gap-4 md:gap-12">
          <div className="hidden md:flex gap-6 font-semibold">
            <Link
              href="/"
              className="uppercase text-gray-700 hover:text-blue-600 transition-colors"
            >
              Women
            </Link>
            <Link
              href="/men"
              className="uppercase text-gray-700 hover:text-blue-600 transition-colors"
            >
              Men
            </Link>
          </div>
          <Link href="/" className="text-3xl font-semibold leading-tight text-black">
            EZRRAH
          </Link>
          <div className="hidden md:flex gap-6 font-semibold">
            <Link
              href="/"
              className="uppercase text-gray-700 hover:text-blue-600 transition-colors"
            >
              Whishlist
            </Link>
            <Link
              href="/products"
              className="uppercase text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
            {/* <div>
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
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
