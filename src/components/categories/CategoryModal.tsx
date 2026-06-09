// src/components/categories/CategoryModal.tsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useUploadFile } from '@/hooks/useUpload';
import type { Category } from '@/types';
import { Loader2, Upload, X } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug: lowercase, numbers, hyphens only'),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  mode: 'create' | 'edit' | 'view';
}

export function CategoryModal({ open, onClose, category, mode }: CategoryModalProps) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const uploadMutation = useUplo
  adFile();

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        thumbnailUrl: category.thumbnailUrl ?? '',
        isActive: category.isActive,
      });
      setPreviewUrl(category.thumbnailUrl ?? '');
    } else {
      reset({ name: '', slug: '', description: '', thumbnailUrl: '', isActive: true });
      setPreviewUrl('');
    }
  }, [category, open]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, WebP allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingThumbnail(true);
    try {
      const result = await uploadMutation.mutateAsync(file);
      setValue('thumbnailUrl', result.publicUrl);
      setPreviewUrl(result.publicUrl);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (mode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (mode === 'edit' && category) {
      await updateMutation.mutateAsync({ id: category.id, payload: data });
    }
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending || uploadingThumbnail;

  const titleMap = { create: 'Create Category', edit: 'Edit Category', view: 'Category Details' };

  return (
    <ModalWrapper open={open} onClose={onClose} title={titleMap[mode]} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...register('name')} disabled={isView} placeholder="e.g. Gaming" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input {...register('slug')} disabled={isView} placeholder="e.g. gaming" />
            {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea {...register('description')} disabled={isView} rows={3} placeholder="Optional description" />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          
          {/* Preview */}
          {previewUrl && (
            <div className="relative w-full h-32 rounded-lg border border-border overflow-hidden bg-muted">
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              {!isView && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setValue('thumbnailUrl', '');
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded hover:bg-red-700"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          )}

          {/* Upload Button */}
          {!isView && !previewUrl && (
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploadingThumbnail ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailUpload}
                disabled={uploadingThumbnail}
              />
            </label>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground">Visible to users</p>
          </div>
          <Switch
            checked={watch('isActive')}
            onCheckedChange={(v) => setValue('isActive', v)}
            disabled={isView}
          />
        </div>

        {!isView && (
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </ModalWrapper>
  );
}
