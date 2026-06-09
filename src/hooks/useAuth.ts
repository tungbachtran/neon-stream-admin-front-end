import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, isSubmitting, error, initialized } =
    useAppSelector((s) => s.auth);

  const logout = () => dispatch(logoutThunk());

  return {
    user,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error,
    initialized,
    logout,
  };
}
