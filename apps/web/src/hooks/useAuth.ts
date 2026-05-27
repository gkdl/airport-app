'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearToken } from '@/lib/auth';

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated() && pathname !== '/login') {
      router.replace('/login');
    }
  }, [pathname, router]);

  return { logout: () => { clearToken(); router.replace('/login'); } };
}
