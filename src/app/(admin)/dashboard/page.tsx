// src/app/(admin)/dashboard/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Diamond, Users, Zap, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalUsers: number;
  activeStreams: number;
  todayRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
}

function StatCard({
  title, value, sub, icon: Icon, iconColor,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-emerald-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/stats');
      return data;
    },
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Admin / Dashboard
        </p>
        <h1 className="text-2xl font-bold">System Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={data?.totalUsers.toLocaleString() ?? '—'}
              sub={`+${data?.userGrowth ?? 0}% vs last month`}
              icon={Users}
              iconColor="bg-blue-500/15 text-blue-400"
            />
            <StatCard
              title="Active Streams"
              value={data?.activeStreams.toLocaleString() ?? '—'}
              sub="● LIVE NOW"
              icon={Zap}
              iconColor="bg-violet-500/15 text-violet-400"
            />
            <StatCard
              title="Today's Revenue"
              value={`$${data?.todayRevenue.toLocaleString() ?? '—'}`}
              sub={`+$${data?.revenueGrowth ?? 0} since midnight`}
              icon={DollarSign}
              iconColor="bg-emerald-500/15 text-emerald-400"
            />
          </>
        )}
      </div>
    </div>
  );
}
