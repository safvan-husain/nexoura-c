import { getCurrentUser } from '@/lib/auth/auth.utils';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <NavbarClient user={user} />
  );
}
