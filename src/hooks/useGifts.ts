import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { giftService, GiftFilters, GiftPayload } from '@/services/gift.service';
import { toast } from 'sonner';

export const GIFT_KEYS = {
  all: ['gifts'] as const,
  list: (f: GiftFilters) => ['gifts', 'list', f] as const,
};

export const useGifts = (filters: GiftFilters) =>
  useQuery({
    queryKey: GIFT_KEYS.list(filters),
    queryFn: () => giftService.getCatalog(filters),
    placeholderData: (prev) => prev,
  });

export const useCreateGift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: GiftPayload) => giftService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFT_KEYS.all });
      toast.success('Gift created');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useUpdateGift = (id: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<GiftPayload>) => giftService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFT_KEYS.all });
      toast.success('Gift updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useDeleteGift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => giftService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFT_KEYS.all });
      toast.success('Gift deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};