// src/components/users/UserDetailModal.tsx
'use client';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useBanUser, useUnbanUser } from '@/hooks/useUsers';
import type { User } from '@/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Diamond } from 'lucide-react';
import { format } from 'date-fns';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({ open, onClose, user }: UserDetailModalProps) {
  const [banReason, setBanReason] = useState('');
  const [showBanInput, setShowBanInput] = useState(false);
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();

  if (!user) return null;

  const handleBan = async () => {
    await banMutation.mutateAsync({ id: user.id, reason: banReason });
    setShowBanInput(false);
    setBanReason('');
    onClose();
  };

  const handleUnban = async () => {
    await unbanMutation.mutateAsync(user.id);
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Chi Tiết Người Dùng" size="lg">
      <div className="space-y-4">
        {/* Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback className="bg-violet-600 text-white text-sm">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm truncate">{user.username}</p>
              <StatusBadge status={user.isBanned ? 'BANNED' : 'ACTIVE'} />
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.fullName}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-400 flex-shrink-0">
            <Diamond className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{user.diamondBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { label: 'ID Người Dùng', value: user.id },
            { label: 'Vai Trò', value: user.role?.displayName ?? user.role?.name ?? '—' },
            { label: 'Số Điện Thoại', value: user.phone ?? '—' },
            { label: 'Đã Xác Minh', value: user.isVerified ? 'Có' : 'Không' },
            { label: 'Lần Đăng Nhập Cuối', value: user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm') : '—' },
            { label: 'Tham Gia', value: format(new Date(user.createdAt), 'dd/MM/yyyy') },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border p-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="font-medium truncate text-xs">{value}</p>
            </div>
          ))}
        </div>

        {/* Ban input */}
        {showBanInput && (
          <div className="space-y-1.5">
            <Label className="text-xs">Lý Do Cấm</Label>
            <Input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Nhập lý do cấm..."
              className="text-sm"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} size="sm">Đóng</Button>
          {user.isBanned ? (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleUnban}
              disabled={unbanMutation.isPending}
              size="sm"
            >
              {unbanMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              Bỏ Cấm
            </Button>
          ) : showBanInput ? (
            <>
              <Button variant="outline" onClick={() => setShowBanInput(false)} size="sm">Hủy</Button>
              <Button
                variant="destructive"
                onClick={handleBan}
                disabled={banMutation.isPending}
                size="sm"
              >
                {banMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
                Xác Nhận
              </Button>
            </>
          ) : (
            <Button variant="destructive" onClick={() => setShowBanInput(true)} size="sm">
              Cấm Người Dùng
            </Button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
