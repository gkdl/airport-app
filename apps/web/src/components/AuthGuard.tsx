'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { href: '/',           label: '대시보드' },
  { href: '/flights',    label: '운항 현황' },
  { href: '/parking',    label: '주차 현황' },
  { href: '/immigration', label: '입출국장' },
  { href: '/weather',    label: '날씨 정보' },
  { href: '/batch',      label: '배치 로그' },
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useRequireAuth();

  if (pathname === '/login') return <>{children}</>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-52 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-700">
          <span className="font-bold text-sm leading-tight">공항 통합 정보<br />관리 시스템</span>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
