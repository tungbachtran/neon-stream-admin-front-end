// src/services/auth.service.ts
import axiosInstance from '@/lib/axios';
import type { AuthUser } from '@/types';

interface LoginPayload { identifier: string; password: string; }
interface AuthResponse { accessToken: string; user: AuthUser; }

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  getMe: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get<AuthUser>('/auth/me');
    return data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};
