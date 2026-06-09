// src/services/user.service.ts
import axiosInstance from '@/lib/axios';
import type { User, PaginatedResponse } from '@/types';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  isBanned?: boolean;
  role?: string;
}

export const userService = {
  getAll: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<User>>(
      '/users/admin',
      { params: filters }
    );
    return data;
  },
  getById: async (id: string): Promise<User> => {
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data;
  },
  ban: async (id: string, reason?: string): Promise<void> => {
    await axiosInstance.post(`/users/${id}/ban`, { reason });
  },
  unban: async (id: string): Promise<void> => {
    await axiosInstance.post(`/users/${id}/unban`);
  },
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await axiosInstance.put<User>(`/users/${id}`, payload);
    return data;
  },
};
