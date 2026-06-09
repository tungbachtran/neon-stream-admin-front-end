// src/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, CategoryFilters, CreateCategoryPayload } from '@/services/category.service';
import { toast } from 'sonner';

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
  list: (filters: CategoryFilters) => ['categories', 'list', filters] as const,
  detail: (id: string) => ['categories', 'detail', id] as const,
};

export const useCategories = (filters: CategoryFilters) =>
  useQuery({
    queryKey: CATEGORY_KEYS.list(filters),
    queryFn: () => categoryService.getAll(filters),

  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoryService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category created successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create'),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCategoryPayload> }) =>
      categoryService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category updated successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });
};
