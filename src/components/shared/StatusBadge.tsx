// src/components/shared/StatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE:     { label: 'Đang Hoạt Động',     className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  BANNED:     { label: 'Bị Cấm',     className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  SUCCESS:    { label: 'Thành Công',    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  PENDING:    { label: 'Đang Chờ',    className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  FAILED:     { label: 'Thất Bại',     className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  CANCELLED:  { label: 'Đã Hủy',  className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  REVERSED:   { label: 'Đã Hoàn Nguyên',   className: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  SUSPICIOUS: { label: 'Đáng Ngờ', className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  REFUNDED:   { label: 'Đã Hoàn Tiền',   className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  COMMON:     { label: 'Thường',     className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  RARE:       { label: 'Hiếm',       className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  EPIC:       { label: 'Tuyệt Vời',       className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  LEGENDARY:  { label: 'Huyền Thoại',  className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
