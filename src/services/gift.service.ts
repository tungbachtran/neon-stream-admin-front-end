import axiosInstance from '@/lib/axios';
import type { GiftCatalog, PaginatedResponse } from '@/types';

export interface GiftFilters {
  page?: number;
  limit?: number;
  search?: string;
  rarity?: string;
  isActive?: boolean;
}

export interface GiftPayload {
  name: string;
  emoji: string;
  diamondCost: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  isActive?: boolean;
  sortOrder?: number;
  iconUrl?: string;
  animationUrl?: string;
  soundKey?: string;
}

export const giftService = {
  getCatalog: async (filters: GiftFilters = {}) => {
    const { data } = await axiosInstance.get<PaginatedResponse<GiftCatalog>>(
      '/gifts/catalog/admin',
      { params: filters },
    );
    return data;
  },

  create: async (payload: GiftPayload) => {
    const { data } = await axiosInstance.post<GiftCatalog>('/gifts', payload);
    return data;
  },

  update: async (id: string, payload: Partial<GiftPayload>) => {
    const { data } = await axiosInstance.put<GiftCatalog>(`/gifts/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/gifts/${id}`);
  },

  uploadIcon: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'system');

    const { data } = await axiosInstance.post('/upload/gift-icon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data as { publicUrl: string };
  },
};