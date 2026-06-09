// src/components/shared/StatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE:     { label: 'Active',     className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  BANNED:     { label: 'Banned',     className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  SUCCESS:    { label: 'Success',    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  PENDING:    { label: 'Pending',    className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  FAILED:     { label: 'Failed',     className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  CANCELLED:  { label: 'Cancelled',  className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  REVERSED:   { label: 'Reversed',   className: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  SUSPICIOUS: { label: 'Suspicious', className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  REFUNDED:   { label: 'Refunded',   className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  COMMON:     { label: 'Common',     className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  RARE:       { label: 'Rare',       className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  EPIC:       { label: 'Epic',       className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  LEGENDARY:  { label: 'Legendary',  className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
