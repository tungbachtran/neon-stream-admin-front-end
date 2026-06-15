'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { fetchMeThunk } from '@/store/slices/authSlice';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, initialized } = useAuth();

  // Gọi getMe 1 lần khi mount
  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  // Sau khi getMe xong → kiểm tra quyền
  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const role = user?.role?.name?.toUpperCase();
    if (role !== 'ADMIN') {
      router.replace('/login?error=forbidden');
    }
  }, [initialized, isAuthenticated, user, router]);

  // ── Loading screen ──
  if (!initialized || isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-violet-600/20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Đang xác minh quyền truy cập...
          </p>
          <p className="text-xs text-muted-foreground">
            Vui lòng chờ một lát
          </p>
        </div>
      </div>
    );
  }

  // Chưa authen hoặc không phải admin → render null (đang redirect)
  if (!isAuthenticated || user?.role?.name?.toUpperCase() !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
