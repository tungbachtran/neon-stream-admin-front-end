// src/components/gifts/GiftModal.tsx
'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { giftService } from '@/services/gift.service';
import type { GiftCatalog } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCreateGift, useUpdateGift } from '@/hooks/useGifts';

const schema = z.object({
  name: z.string().min(1),
  emoji: z.string().min(1),
  diamondCost: z.coerce.number().min(1),
  rarity: z.enum(['COMMON', 'RARE', 'EPIC', 'LEGENDARY']),
  sortOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
  iconUrl: z.string().optional(),
  soundKey: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface GiftModalProps {
  open: boolean;
  onClose: () => void;
  gift?: GiftCatalog | null;
  mode: 'create' | 'edit' | 'view';
}

export function GiftModal({ open, onClose, gift, mode }: GiftModalProps) {
  const isView = mode === 'view';
  const qc = useQueryClient();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift(gift?.id ?? '');

  const onSubmit = async (data: FormData) => {
    if (mode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (mode === 'edit' && gift) {
      await updateMutation.mutateAsync(data);
    }

    onClose();
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await giftService.uploadIcon(file);
    setValue('iconUrl', result.publicUrl);
    toast.success('Biểu tượng đã được tải lên');
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      if (gift) {
        reset({
          name: gift.name,
          emoji: gift.emoji,
          diamondCost: gift.diamondCost,
          rarity: gift.rarity,
          sortOrder: gift.sortOrder,
          isActive: gift.isActive,
          iconUrl: gift.iconUrl ?? '',
          soundKey: gift.soundKey ?? '',
        });
      } else if (mode === 'create') {
        reset({
          name: '',
          emoji: '',
          diamondCost: 1,
          rarity: 'COMMON',
          sortOrder: 0,
          isActive: true,
          iconUrl: '',
          soundKey: '',
        });
      }
    }
  }, [gift, open, mode, reset]);

  return (
    <ModalWrapper open={open} onClose={onClose} title={isView ? 'Chi Tiết Quà Tặng' : mode === 'create' ? 'Tạo Quà Tặng' : 'Chỉnh Sửa Quà Tặng'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Tên</Label>
            <Input {...register('name')} disabled={isView} className="text-sm h-8" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Emoji</Label>
            <Input {...register('emoji')} disabled={isView} className="text-sm h-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Giá Kim Cương</Label>
            <Input type="number" {...register('diamondCost')} disabled={isView} className="text-sm h-8" />
            {errors.diamondCost && <p className="text-xs text-red-400">{errors.diamondCost.message}</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Thứ Tự</Label>
            <Input type="number" {...register('sortOrder')} disabled={isView} className="text-sm h-8" />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Độ Hiếm</Label>
          <Select
            value={watch('rarity')}
            onValueChange={(v) => setValue('rarity', v as any)}
            disabled={isView}
          >
            <SelectTrigger className="text-sm h-8">
              <SelectValue placeholder="Chọn độ hiếm" />
            </SelectTrigger>
            <SelectContent>
              {['COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map((r) => (
                <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Biểu Tượng</Label>
          {watch('iconUrl') && (
            <div className="h-16 w-16 rounded-lg border overflow-hidden bg-muted">
              <img src={watch('iconUrl')} alt="gift icon" className="h-full w-full object-cover" />
            </div>
          )}
          {!isView && (
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleIconUpload}
              className="text-xs h-8"
            />
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
          <p className="text-xs font-medium">Hoạt Động</p>
          <Switch
            checked={watch('isActive')}
            onCheckedChange={(v) => setValue('isActive', v)}
            disabled={isView}
          />
        </div>

        {!isView && (
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} size="sm">Hủy</Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              {mode === 'create' ? 'Tạo' : 'Lưu'}
            </Button>
          </div>
        )}
      </form>
    </ModalWrapper>
  );
}
