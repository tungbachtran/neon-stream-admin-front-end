// src/app/(admin)/categories/page.tsx
'use client';
import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CategoryModal } from '@/components/categories/CategoryModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@/types';
import { format } from 'date-fns';

type ModalMode = 'create' | 'edit' | 'view';

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selected, setSelected] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Dùng useCategoriesAdmin thay vì useCategories
  const { data, isLoading } = useCategories({ page, limit: 10, search });
  console.log('Fetched categories:', data);
  const deleteMutation = useDeleteCategory();

  const openModal = (mode: ModalMode, category?: Category) => {
    setModalMode(mode);
    setSelected(category ?? null);
    setModalOpen(true);
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Tên',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnailUrl ? (
            <img src={row.thumbnailUrl} alt={row.name} className="h-8 w-8 rounded object-cover" />
          ) : (
            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
              {row.name[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Mô Tả',
      cell: (row) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
          {row.description ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      cell: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'createdAt',
      header: 'Ngày Tạo',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), 'dd/MM/yyyy')}
        </span>
      ),
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
              <Eye className="h-4 w-4 mr-2" /> Xem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModal('edit', row)}>
              <Pencil className="h-4 w-4 mr-2" /> Chỉnh Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh Mục</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh mục nội dung của nền tảng</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => openModal('create')}>
          <Plus className="h-4 w-4 mr-2" /> Thêm Danh Mục
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Tìm kiếm danh mục..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          rowKey={(r) => r.id}
          emptyMessage="Không tìm thấy danh mục nào"
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

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={selected}
        mode={modalMode}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Danh Mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{deleteTarget?.name}</strong>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                if (deleteTarget) {
                  await deleteMutation.mutateAsync(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
