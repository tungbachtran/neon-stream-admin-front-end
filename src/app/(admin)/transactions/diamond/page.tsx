// src/app/(admin)/transactions/diamond/page.tsx
'use client';
import { useState } from 'react';
import { useDiamondTransactions } from '@/hooks/useTransactions';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { DiamondTransaction } from '@/types';
import { format } from 'date-fns';
import { Diamond, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiamondTransactionDetailModal } from '@/components/transactions/DiamondTransactionDetailModal';

export default function DiamondTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { data, isLoading } = useDiamondTransactions({
    page, limit: 15, search,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const columns: Column<DiamondTransaction>[] = [
    {
      key: 'txnRef',
      header: 'Mã Giao Dịch',
      cell: (row) => (
        <span className="text-xs font-mono text-muted-foreground">{row.txnRef}</span>
      ),
    },
    {
      key: 'user',
      header: 'Người Dùng',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">{row.user?.username ?? row.userId.slice(0, 8)}</p>
          <p className="text-xs text-muted-foreground">{row.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'package',
      header: 'Gói',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">{row.diamondPackage}</p>
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Diamond className="h-3 w-3" />
            {row.diamondAmount.toLocaleString()}
            {row.bonusDiamondAmount > 0 && (
              <span className="text-emerald-400 ml-1">+{row.bonusDiamondAmount}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Số Tiền',
      cell: (row) => (
        <span className="text-sm font-semibold">
          {row.amountVnd.toLocaleString('vi-VN')}₫
        </span>
      ),
    },
    {
      key: 'method',
      header: 'Phương Thức',
      cell: (row) => (
        <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium">
          {row.paymentMethod}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'bank',
      header: 'Ngân Hàng',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.vnpBankCode ?? '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày',
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
        <h1 className="text-2xl font-bold">Giao Dịch Kim Cương</h1>
        <p className="text-sm text-muted-foreground">Lịch sử thanh toán và hồ sơ nạp kim cương</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder="Tìm kiếm theo mã giao dịch hoặc người dùng..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
        <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Tất Cả Trạng Thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất Cả Trạng Thái</SelectItem>
            {['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REVERSED', 'SUSPICIOUS'].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date" className="h-9 w-36"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
        />
        <Input
          type="date" className="h-9 w-36"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          rowKey={(r) => r.id}
          emptyMessage="Không tìm thấy giao dịch nào"
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
      <DiamondTransactionDetailModal
        open={!!selectedId}
        onClose={() => setSelectedId(undefined)}
        transactionId={selectedId}
      />
    </div>
  );
}
