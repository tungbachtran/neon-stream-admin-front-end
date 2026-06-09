import { useQuery } from '@tanstack/react-query';
import {
  transactionService,
  TransactionFilters,
} from '@/services/transaction.service';

export const TRANSACTION_KEYS = {
  diamonds: (f: TransactionFilters) => ['transactions', 'diamonds', f] as const,
  diamondDetail: (id: string) => ['transactions', 'diamonds', 'detail', id] as const,
  gifts: (f: TransactionFilters) => ['transactions', 'gifts', f] as const,
  giftDetail: (id: string) => ['transactions', 'gifts', 'detail', id] as const,
};

export const useDiamondTransactions = (filters: TransactionFilters) =>
  useQuery({
    queryKey: TRANSACTION_KEYS.diamonds(filters),
    queryFn: () => transactionService.getDiamondTransactions(filters),
    placeholderData: (prev) => prev,
  });

export const useDiamondTransactionDetail = (id?: string) =>
  useQuery({
    queryKey: TRANSACTION_KEYS.diamondDetail(id ?? ''),
    queryFn: () => transactionService.getDiamondTransactionDetail(id!),
    enabled: !!id,
  });

export const useGiftTransactions = (filters: TransactionFilters) =>
  useQuery({
    queryKey: TRANSACTION_KEYS.gifts(filters),
    queryFn: () => transactionService.getGiftTransactions(filters),
    placeholderData: (prev) => prev,
  });

export const useGiftTransactionDetail = (id?: string) =>
  useQuery({
    queryKey: TRANSACTION_KEYS.giftDetail(id ?? ''),
    queryFn: () => transactionService.getGiftTransactionDetail(id!),
    enabled: !!id,
  });