'use client';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useRequireAuth();

  if (pathname === '/login') return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800">공항 통합 정보 관리</span>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          로그아웃
        </button>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
