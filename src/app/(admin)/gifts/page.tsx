// src/app/(admin)/gifts/page.tsx
'use client';
import { useState } from 'react';
import { useGifts } from '@/hooks/useGifts';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GiftModal } from '@/components/gifts/GiftModal';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Pencil, Trash2, Diamond } from 'lucide-react';
import type { GiftCatalog } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { giftService } from '@/services/gift.service';
import { toast } from 'sonner';
import { GIFT_KEYS } from '@/hooks/useGifts';

export default function GiftsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selected, setSelected] = useState<GiftCatalog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GiftCatalog | null>(null);

  const qc = useQueryClient();
  const { data, isLoading } = useGifts({ page, limit: 10, search, rarity: rarity || undefined });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => giftService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFT_KEYS.all });
      toast.success('Gift deleted');
      setDeleteTarget(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const openModal = (mode: 'edit' | 'view', gift: GiftCatalog) => {
    setModalMode(mode);
    setSelected(gift);
    setModalOpen(true);
  };

  const rarityColorMap: Record<string, string> = {
    COMMON: 'text-slate-400',
    RARE: 'text-blue-400',
    EPIC: 'text-purple-400',
    LEGENDARY: 'text-amber-400',
  };

  const columns: Column<GiftCatalog>[] = [
    {
      key: 'gift',
      header: 'Gift',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-xl">
            {row.emoji}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className={`text-xs font-medium ${rarityColorMap[row.rarity]}`}>{row.rarity}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-amber-400">
          <Diamond className="h-3.5 w-3.5" />
          {row.diamondCost.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'rarity',
      header: 'Rarity',
      cell: (row) => <StatusBadge status={row.rarity} />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'BANNED'} />,
    },
    {
      key: 'sortOrder',
      header: 'Order',
      cell: (row) => <span className="text-sm text-muted-foreground">{row.sortOrder}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openModal('view', row)}>
              <Eye className="h-4 w-4 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModal('edit', row)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gifts</h1>
          <p className="text-sm text-muted-foreground">Manage monetization gift catalog</p>
        </div>
      </div>
      <Button
        className="bg-violet-600 hover:bg-violet-700"
        onClick={() => {
          setSelected(null);
          setModalMode('create');
          setModalOpen(true);
        }}
      >
        Create Gift
      </Button>

      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search gifts..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
        <Select value={rarity} onValueChange={(v) => { setRarity(v === 'ALL' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Rarities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Rarities</SelectItem>
            {['COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          rowKey={(r) => r.id}
          emptyMessage="No gifts found"
        />
        {data && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            total={data.total}
            limit={10}
            onPageChange={setPage}
          />
        )}
      </div>

      <GiftModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        gift={selected}
        mode={modalMode}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gift</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GiftModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        gift={selected}
        mode={modalMode}
      />
    </div>
  );
}
