// src/services/category.service.ts
import axiosInstance from '@/lib/axios';
import type { Category, PaginatedResponse } from '@/types';

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
}

export const categoryService = {
  getAll: async (filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Category>>(
      '/categories/admin/all',
      { params: filters }
    );
    return data;
  },
  getById: async (id: string): Promise<Category> => {
    const { data } = await axiosInstance.get<Category>(`/categories/${id}`);
    return data;
  },
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await axiosInstance.post<Category>('/categories', payload);
    return data;
  },
  update: async (id: string, payload: Partial<CreateCategoryPayload>): Promise<Category> => {
    const { data } = await axiosInstance.put<Category>(`/categories/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
