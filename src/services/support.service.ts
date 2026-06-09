// src/services/support.service.ts
import axiosInstance from '@/lib/axios';

export interface SupportTicket {
  id: string;
  userId: string;
  user?: { username: string; avatar: string | null };
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  lastMessage?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'USER' | 'ADMIN';
  content: string;
  createdAt: string;
}

export const supportService = {
  getTickets: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await axiosInstance.get('/support/tickets', { params });
    return data;
  },
  getMessages: async (ticketId: string) => {
    const { data } = await axiosInstance.get(`/support/tickets/${ticketId}/messages`);
    return data;
  },
  sendMessage: async (ticketId: string, content: string) => {
    const { data } = await axiosInstance.post(`/support/tickets/${ticketId}/messages`, { content });
    return data;
  },
  closeTicket: async (ticketId: string) => {
    await axiosInstance.patch(`/support/tickets/${ticketId}/close`);
  },
};
