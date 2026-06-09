// src/app/(admin)/transactions/gifts/page.tsx
'use client';
import { useState } from 'react';
import { useGiftTransactions } from '@/hooks/useTransactions';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { GiftTransaction } from '@/types';
import { format } from 'date-fns';
import { Diamond, ArrowRight, Eye } from 'lucide-react';
import { useGifts } from '@/hooks/useGifts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GiftTransactionDetailModal } from '@/components/transactions/GiftTransactionDetailModal';

export default function GiftTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [giftId, setGiftId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { data, isLoading } = useGiftTransactions({
    page,
    limit: 15,
    search,
    status: status || undefined,
    giftId: giftId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const { data: giftsData } = useGifts({ page: 1, limit: 100 });
  const columns: Column<GiftTransaction>[] = [
    {
      key: 'id',
      header: 'ID',
      cell: (row) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'gift',
      header: 'Gift',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xl">{row.gift?.emoji}</span>
          <div>
            <p className="text-sm font-medium">{row.gift?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">×{row.quantity}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'transfer',
      header: 'Transfer',
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-violet-400">{row.sender?.username ?? row.senderId.slice(0, 8)}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-emerald-400">{row.receiver?.username ?? row.receiverId.slice(0, 8)}</span>
        </div>
      ),
    },
    {
      key: 'diamonds',
      header: 'Diamonds',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-amber-400">
          <Diamond className="h-3.5 w-3.5" />
          {row.totalDiamonds.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedId(row.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gift Transactions</h1>
        <p className="text-sm text-muted-foreground">Gift exchange history across all streams</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder="Search by user, gift, idempotency key..."
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v === 'ALL' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={giftId}
          onValueChange={(v) => {
            setGiftId(v === 'ALL' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All Gifts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Gifts</SelectItem>
            {(giftsData?.data ?? []).map((gift) => (
              <SelectItem key={gift.id} value={gift.id}>
                {gift.emoji} {gift.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          className="h-9 w-36"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />

        <Input
          type="date"
          className="h-9 w-36"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          rowKey={(r) => r.id}
          emptyMessage="No gift transactions found"
        />
        {data && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            total={data.total}
            limit={15}
            onPageChange={setPage}
          />
        )}
      </div>
      <GiftTransactionDetailModal
        open={!!selectedId}
        onClose={() => setSelectedId(undefined)}
        transactionId={selectedId}
      />
    </div>
  );
}
