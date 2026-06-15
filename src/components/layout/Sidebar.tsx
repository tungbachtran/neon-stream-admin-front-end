// src/components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Tag, Gift, Users,
  CreditCard, MessageSquare, LogOut, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutThunk } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard',                  label: 'Bảng Điều Khiển',     icon: LayoutDashboard },
  { href: '/categories',                 label: 'Danh Mục',            icon: Tag },
  { href: '/gifts',                      label: 'Quà Tặng',            icon: Gift },
  { href: '/users',                      label: 'Người Dùng',          icon: Users },
  { href: '/transactions/diamond',       label: 'Giao Dịch Kim Cương', icon: CreditCard },
  { href: '/transactions/gifts',         label: 'Giao Dịch Quà Tặng',  icon: Gift },
  { href: '/support',                    label: 'Hỗ Trợ Chat',        icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push('/login');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#0f0f14] border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Bảng Điều Khiển Quản Trị</p>
          <p className="text-xs text-muted-foreground">Giám Sát Hệ Thống</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng Xuất
        </Button>
      </div>
    </aside>
  );
}
