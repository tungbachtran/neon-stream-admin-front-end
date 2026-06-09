import axiosInstance from '@/lib/axios';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'USER' | 'ADMIN';
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  adminId?: string | null;
  status: 'ACTIVE' | 'CLOSED';
  updatedAt: string;
  createdAt: string;
  user?: {
    id: string;
    fullName?: string;
    email: string;
    avatar?: string;
  };
  admin?: {
    id: string;
    fullName?: string;
    email: string;
  } | null;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  pages: number;
}

export const chatApi = {
  /** Admin lấy tất cả conversations */
  getAdminConversations: (limit = 100): Promise<ChatConversation[]> =>
    axiosInstance
      .get('/chat/admin/conversations', { params: { limit } })
      .then((r) => r.data),

  /** Lấy tin nhắn phân trang */
  getMessages: (
    conversationId: string,
    page = 1,
    limit = 20,
  ): Promise<MessagesResponse> =>
    axiosInstance
      .get(`/chat/conversation/${conversationId}/messages`, {
        params: { page, limit },
      })
      .then((r) => r.data),
};
