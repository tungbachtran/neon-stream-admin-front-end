'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminConversations,
  useAdminMessages,
  useAdminChatSocket,
} from '@/hooks/useAdminChat';

import { adminChatSocket } from '@/lib/socket/chat.socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, X, AlertCircle, Loader2, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ChatConversation } from '@/services/chat.service';

export default function AdminSupportPage() {
  const { user: admin } = useAuth();
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'CLOSED' | 'ALL'>('ACTIVE');
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [msgPage, setMsgPage] = useState(1);
  const [input, setInput] = useState('');
  const [userTyping, setUserTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>();

  // ── Data ──
  const { data: conversations = [], isLoading: loadingConvs } =
    useAdminConversations();
  const { data: msgData, isLoading: loadingMsgs } = useAdminMessages(
    activeConv?.id,
    msgPage,
  );
  const { sendMessage, sendTyping, closeConversation } = useAdminChatSocket(
    admin?.id,
    activeConv?.id,
  );

  const messages = msgData?.messages || [];
  const totalPages = msgData?.pages || 1;

  // ── Lắng nghe user typing + conversation closed ──
  useEffect(() => {
    if (!activeConv?.id) return;
    const socket = adminChatSocket.instance;
    if (!socket) return;

    const onUserTyping = () => {
      setUserTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setUserTyping(false), 3000);
    };

    const onClosed = () => {
      toast.info('Cuộc trò chuyện đã đóng');
      setActiveConv(null);
      qc.invalidateQueries({ queryKey: ['chat', 'admin', 'conversations'] });
    };

    socket.on('user:typing', onUserTyping);
    socket.on('conversation:closed', onClosed);

    return () => {
      socket.off('user:typing', onUserTyping);
      socket.off('conversation:closed', onClosed);
    };
  }, [activeConv?.id, qc]);

  // ── Auto scroll ──
  useEffect(() => {
    if (msgPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, msgPage]);

  // ── Chọn conversation ──
  const handleSelectConv = (conv: ChatConversation) => {
    setActiveConv(conv);
    setMsgPage(1);
  };

  // ── Gửi tin ──
  const handleSend = useCallback(() => {
    if (!input.trim() || !activeConv) return;
    sendMessage(input.trim());
    setInput('');
  }, [input, activeConv, sendMessage]);

  // ── Helpers ──
  const getUserLabel = (c: ChatConversation) =>
    c.user?.fullName || c.user?.email || c.userId.slice(0, 8);

  const filtered = conversations
    .filter((c) => statusFilter === 'ALL' || c.status === statusFilter)
    .filter((c) => {
      if (!search) return true;
      return getUserLabel(c).toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] rounded-xl border border-border overflow-hidden bg-card">
      {/* ── Sidebar ── */}
      <div className="w-80 flex flex-col border-r border-border shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Cuộc Trò Chuyện</h2>
            <Badge
              variant="outline"
              className="bg-violet-500/15 text-violet-400 border-violet-500/30 text-xs"
            >
              {filtered.length}
            </Badge>
          </div>

          <Input
            placeholder="Tìm kiếm người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs"
          />

          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Đang Hoạt Động</SelectItem>
              <SelectItem value="CLOSED">Đã Đóng</SelectItem>
              <SelectItem value="ALL">Tất Cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {loadingConvs ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang tải...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
              <AlertCircle className="h-5 w-5 opacity-40" />
              Không có cuộc trò chuyện
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={cn(
                  'w-full text-left p-4 hover:bg-muted/40 transition-colors border-l-2 border-transparent',
                  activeConv?.id === conv.id &&
                  'bg-muted/60 border-l-violet-500',
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={conv.user?.avatar} />
                    <AvatarFallback className="bg-violet-600 text-white text-xs">
                      {getUserLabel(conv)[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getUserLabel(conv)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] px-1.5 py-0',
                          conv.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-500/15 text-slate-400 border-slate-500/30',
                        )}
                      >
                        {conv.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Đã Đóng'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(conv.updatedAt), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat panel ── */}
      {activeConv ? (
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeConv.user?.avatar} />
                <AvatarFallback className="bg-violet-600 text-white text-xs">
                  {getUserLabel(activeConv)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {getUserLabel(activeConv)}
                </p>
                <p className="text-xs text-emerald-400">● Đang Hoạt Động</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                className="mx-auto flex"
                onClick={() => setMsgPage((p) => p + 1)}
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Tải tin cũ hơn
              </Button>
            )}

            {loadingMsgs && msgPage === 1 ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center py-10 text-muted-foreground text-sm">
                Chưa có tin nhắn
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.senderRole === 'ADMIN';
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      isAdmin ? 'justify-end' : 'justify-start',
                    )}
                  >
                    {!isAdmin && (
                      <Avatar className="h-7 w-7 mr-2 shrink-0 mt-1">
                        <AvatarImage src={activeConv.user?.avatar} />
                        <AvatarFallback className="bg-violet-600 text-white text-xs">
                          {getUserLabel(activeConv)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[65%] rounded-2xl px-4 py-2.5 text-sm',
                        isAdmin
                          ? 'bg-violet-600 text-white rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm',
                      )}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-1',
                          isAdmin
                            ? 'text-violet-200'
                            : 'text-muted-foreground',
                        )}
                      >
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {/* User typing indicator */}
            {userTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 flex gap-1">
                  {[0, 100, 200].map((d) => (
                    <div
                      key={d}
                      className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder={
                  activeConv.status === 'CLOSED'
                    ? 'Cuộc trò chuyện đã đóng'
                    : 'Nhập tin nhắn...'
                }
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  sendTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={activeConv.status === 'CLOSED'}
              />
              <Button
                size="icon"
                className="bg-violet-600 hover:bg-violet-700 shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || activeConv.status === 'CLOSED'}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-muted-foreground gap-3">
          <AlertCircle className="h-10 w-10 opacity-30" />
          <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      )}
    </div>
  );
}
