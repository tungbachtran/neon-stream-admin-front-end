'use client';

import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useGiftTransactionDetail } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { ArrowRight, Diamond, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  transactionId?: string;
}

export function GiftTransactionDetailModal({
  open,
  onClose,
  transactionId,
}: Props) {
  const { data, isLoading } = useGiftTransactionDetail(
    open ? transactionId : undefined,
  );

  return (
    <ModalWrapper open={open} onClose={onClose} title="Gift Transaction Detail" size="lg">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {data && (
        <div className="space-y-5 pt-2">
          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-sm font-semibold">Transfer</h3>
            <div className="flex items-center justify-between gap-4">
              <UserCard title="Sender" user={data.sender} fallback={data.senderId} />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <UserCard title="Receiver" user={data.receiver} fallback={data.receiverId} />
            </div>
          </section>

          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-sm font-semibold">Gift</h3>
            <div className="flex items-center gap-3">
              {data.gift?.iconUrl ? (
                <img
                  src={data.gift.iconUrl}
                  alt={data.gift.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                  {data.gift?.emoji ?? '🎁'}
                </div>
              )}

              <div>
                <p className="text-sm font-medium">{data.gift?.name ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{data.gift?.rarity ?? '—'}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Transaction ID" value={data.id} />
            <Info label="Status" value={<StatusBadge status={data.status} />} />
            <Info label="Quantity" value={`×${data.quantity}`} />
            <Info
              label="Total Diamonds"
              value={
                <span className="inline-flex items-center gap-1 text-amber-400">
                  <Diamond className="h-3.5 w-3.5" />
                  {data.totalDiamonds.toLocaleString()}
                </span>
              }
            />
            <Info label="Idempotency Key" value={data.idempotencyKey} />
            <Info label="Stream ID" value={data.streamId} />
            <Info
              label="Created At"
              value={format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm:ss')}
            />
          </section>
        </div>
      )}
    </ModalWrapper>
  );
}

function UserCard({
  title,
  user,
  fallback,
}: {
  title: string;
  user?: any;
  fallback: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-lg bg-muted/40 p-3">
      {user?.avatar && (
        <img
          src={user.avatar}
          alt={user.username}
          className="h-10 w-10 rounded-full object-cover"
        />
      )}
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{user?.username ?? fallback.slice(0, 8)}</p>
        <p className="text-xs text-muted-foreground">{user?.email ?? '—'}</p>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 break-all font-medium">{value}</div>
    </div>
  );
}