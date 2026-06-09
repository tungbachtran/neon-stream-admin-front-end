// src/services/upload.service.ts
import axiosInstance from '@/lib/axios';

export interface PresignedUploadResponse {
  fileId: string;
  uploadUrl: string;
  objectKey: string;
  expiresAt: Date;
}

export interface UploadResponseDto {
  fileId: string;
  objectKey: string;
  bucketName: string;
  publicUrl: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

export const uploadService = {
  /**
   * POST /upload/presigned
   * Lấy presigned URL để upload file lên MinIO
   */
  requestPresignedUrl: async (
    fileName: string,
    fileType: 'AVATAR' | 'THUMBNAIL' | 'RECORDING' | 'ATTACHMENT',
  ): Promise<PresignedUploadResponse> => {
    const { data } = await axiosInstance.post<PresignedUploadResponse>(
      '/upload/presigned',
      { fileName, fileType }
    );
    return data;
  },

  /**
   * PUT to presigned URL
   * Upload file trực tiếp lên MinIO (không qua backend)
   */
  uploadToPresignedUrl: async (
    presignedUrl: string,
    file: File,
  ): Promise<void> => {
    await axiosInstance.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  /**
   * POST /upload/confirm/:fileId
   * Confirm upload sau khi file đã được upload lên MinIO
   */
  confirmUpload: async (fileId: string): Promise<UploadResponseDto> => {
    const { data } = await axiosInstance.post<UploadResponseDto>(
      `/upload/confirm/${fileId}`,
      { userId: 'admin' } // hoặc lấy từ auth context
    );
    return data;
  },

  /**
   * GET /upload/:fileId/download-url
   * Lấy presigned download URL
   */
  getDownloadUrl: async (fileId: string): Promise<{ uploadUrl: string; expiresAt: Date }> => {
    const { data } = await axiosInstance.get(
      `/upload/${fileId}/download-url`,
      { data: { userId: 'admin' } }
    );
    return data;
  },

  async uploadImage(file: File): Promise<UploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
  
    // nếu backend đang bắt userId thì append thêm
    const userId = localStorage.getItem('userId');
    if (userId) {
      formData.append('userId', userId);
    }
  
    const res = await axiosInstance.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return res.data;
  },

  /**
   * DELETE /upload/:fileId
   * Xoá file
   */
  deleteFile: async (fileId: string): Promise<void> => {
    await axiosInstance.delete(`/upload/${fileId}`, {
      data: { userId: 'admin' }
    });
  },
};
