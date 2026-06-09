'use client';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { adminChatSocket } from '@/lib/socket/chat.socket';
import { chatApi, ChatMessage, MessagesResponse } from '@/services/chat.service';

// ── Lấy danh sách conversations ──────────────────────────

export function useAdminConversations() {
  return useQuery({
    queryKey: ['chat', 'admin', 'conversations'],
    queryFn: () => chatApi.getAdminConversations(100),
    refetchInterval: 5000, // poll mỗi 5s để cập nhật danh sách
  });
}

// ── Lấy messages của 1 conversation ─────────────────────

export function useAdminMessages(conversationId?: string, page = 1) {
  return useQuery({
    queryKey: ['chat', 'admin', 'messages', conversationId, page],
    queryFn: () => chatApi.getMessages(conversationId!, page, 20),
    enabled: !!conversationId,
    staleTime: 30_000,
  });
}

// ── Socket: kết nối, join room, nhận/gửi message ─────────

export function useAdminChatSocket(
  adminId?: string,
  conversationId?: string,
) {
  const qc = useQueryClient();
  const prevConvRef = useRef<string | undefined>();

  // Kết nối socket 1 lần khi có adminId
  useEffect(() => {
    if (!adminId) return;
    const token = localStorage.getItem('access_token') || '';
    adminChatSocket.connect(token);
  }, [adminId]);

  // Join conversation mới, rời conversation cũ
  useEffect(() => {
    if (!adminId || !conversationId) return;
    const socket = adminChatSocket.instance;
    if (!socket) return;

    const doJoin = () => {
      socket.emit('admin:join', { adminId, conversationId });
      prevConvRef.current = conversationId;
    };

    if (socket.connected) {
      doJoin();
    } else {
      socket.once('connect', doJoin);
    }

    // Nhận tin nhắn mới → cập nhật cache
    const onMessage = (msg: ChatMessage) => {
      qc.setQueryData<MessagesResponse>(
        ['chat', 'admin', 'messages', conversationId, 1],
        (old) => {
          if (!old) return old;
          const exists = old.messages.some((m) => m.id === msg.id);
          if (exists) return old;
          return { ...old, messages: [...old.messages, msg] };
        },
      );
      // Refresh sidebar để cập nhật updatedAt
      qc.invalidateQueries({ queryKey: ['chat', 'admin', 'conversations'] });
    };

    // Có user mới online hoặc gửi message → refresh sidebar
    const onSidebarRefresh = () => {
      qc.invalidateQueries({ queryKey: ['chat', 'admin', 'conversations'] });
    };

    socket.on('message:new', onMessage);
    socket.on('admin:new-message', onSidebarRefresh);
    socket.on('admin:user-online', onSidebarRefresh);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('admin:new-message', onSidebarRefresh);
      socket.off('admin:user-online', onSidebarRefresh);
      socket.off('connect', doJoin);
    };
  }, [adminId, conversationId, qc]);

  // Gửi tin nhắn
  const sendMessage = (content: string) => {
    if (!conversationId) return;
    adminChatSocket.instance?.emit('admin:send-message', {
      conversationId,
      content,
    });
  };

  // Typing indicator
  const sendTyping = () => {
    if (!conversationId) return;
    adminChatSocket.instance?.emit('admin:typing', { conversationId });
  };

  // Đóng conversation
  const closeConversation = () => {
    if (!conversationId) return;
    adminChatSocket.instance?.emit('admin:close', { conversationId });
  };

  return { sendMessage, sendTyping, closeConversation };
}
