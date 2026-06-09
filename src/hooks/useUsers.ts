// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserFilters } from '@/services/user.service';
import { toast } from 'sonner';

export const USER_KEYS = {
  all: ['users'] as const,
  list: (filters: UserFilters) => ['users', 'list', filters] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

export const useUsers = (filters: UserFilters) =>
  useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => userService.getAll(filters),
    placeholderData: (prev) => prev,
  });

export const useUserDetail = (id: string) =>
  useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });

export const useBanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      userService.ban(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success('User banned');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to ban'),
  });
};

export const useUnbanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.unban(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success('User unbanned');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to unban'),
  });
};
