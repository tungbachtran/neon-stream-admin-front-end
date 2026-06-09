// src/app/(admin)/users/page.tsx
'use client';
import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Diamond } from 'lucide-react';
import type { User } from '@/types';
import { format } from 'date-fns';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [banFilter, setBanFilter] = useState<string>('');
  const [selected, setSelected] = useState<User | null>(null);

  const isBanned = banFilter === 'banned' ? true : banFilter === 'active' ? false : undefined;
  const { data, isLoading } = useUsers({ page, limit: 10, search, isBanned });

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      cell: (row) => (
        <span className="text-xs text-muted-foreground font-mono">
          #{row.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar ?? ''} />
            <AvatarFallback className="bg-violet-600 text-white text-xs">
              {row.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.username}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.role?.displayName ?? row.role?.name ?? '—'}
        </span>
      ),
    },
    {
      key: 'diamonds',
      header: 'Balance',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-amber-400">
          <Diamond className="h-3.5 w-3.5" />
          {row.diamondBalance.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.isBanned ? 'BANNED' : 'ACTIVE'} />,
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.lastLogin ? format(new Date(row.lastLogin), 'dd/MM/yyyy HH:mm') : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <Button
          variant="ghost" size="icon" className="h-8 w-8"
          onClick={() => setSelected(row)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor platform users
            {data && (
              <span className="ml-2 text-violet-400 font-medium">
                ({data.total.toLocaleString()} total)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search by username or email..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
        <Select
          value={banFilter}
          onValueChange={(v) => { setBanFilter(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          rowKey={(r) => r.id}
          emptyMessage="No users found"
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

      <UserDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        user={selected}
      />
    </div>
  );
}
