import axiosInstance from '@/lib/axios';
import type {
  DiamondTransaction,
  GiftTransaction,
  PaginatedResponse,
} from '@/types';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  giftId?: string;
}

export const transactionService = {
  getDiamondTransactions: async (
    filters: TransactionFilters = {},
  ): Promise<PaginatedResponse<DiamondTransaction>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<DiamondTransaction>>(
      '/payment/admin/transactions',
      { params: filters },
    );
    return data;
  },

  getDiamondTransactionDetail: async (
    id: string,
  ): Promise<DiamondTransaction> => {
    const { data } = await axiosInstance.get<DiamondTransaction>(
      `/payment/admin/transactions/${id}`,
    );
    return data;
  },

  getGiftTransactions: async (
    filters: TransactionFilters = {},
  ): Promise<PaginatedResponse<GiftTransaction>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<GiftTransaction>>(
      '/gifts/admin/transactions',
      { params: filters },
    );
    return data;
  },

  getGiftTransactionDetail: async (
    id: string,
  ): Promise<GiftTransaction> => {
    const { data } = await axiosInstance.get<GiftTransaction>(
      `/gifts/admin/transactions/${id}`,
    );
    return data;
  },
};