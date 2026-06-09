// src/hooks/useUpload.ts
import { useMutation } from '@tanstack/react-query';
import { uploadService, UploadResponseDto } from '@/services/upload.service';
import { toast } from 'sonner';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponseDto> => {
      return uploadService.uploadImage(file);
    },
    onSuccess: () => {
      toast.success('Upload ảnh thành công');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Upload ảnh thất bại');
    },
  });
};