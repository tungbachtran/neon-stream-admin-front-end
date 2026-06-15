'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { loginThunk, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const schema = z.object({
  identifier: z.string().min(1, 'Email hoặc số điện thoại là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

type FormData = z.infer<typeof schema>;

// ─── Tách riêng component dùng useSearchParams ────────────────────────────
function ForbiddenAlert() {
  const searchParams = useSearchParams();
  const isForbidden = searchParams.get('error') === 'forbidden';

  if (!isForbidden) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Truy cập bị từ chối. Yêu cầu vai trò quản trị viên.
      </AlertDescription>
    </Alert>
  );
}

// ─── Main page component ──────────────────────────────────────────────────
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, isSubmitting, error, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && user?.role?.name?.toUpperCase() === 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = (data: FormData) => {
    dispatch(clearError());
    dispatch(loginThunk(data));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Bảng Điều Khiển Quản Trị</h1>
            <p className="text-sm text-muted-foreground">
              Giám Sát Hệ Thống — Truy Cập Hạn Chế
            </p>
          </div>
        </div>

        {/* ✅ Wrap trong Suspense — bắt buộc cho useSearchParams */}
        <Suspense fallback={null}>
          <ForbiddenAlert />
        </Suspense>

        {/* Error từ Redux */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="identifier">Email / Số Điện Thoại</Label>
            <Input
              id="identifier"
              placeholder="admin@example.com"
              className="bg-muted/30"
              {...register('identifier')}
            />
            {errors.identifier && (
              <p className="text-xs text-red-400">
                {errors.identifier.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật Khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-muted/30"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Đăng Nhập
          </Button>
        </form>
      </div>
    </div>
  );
}
