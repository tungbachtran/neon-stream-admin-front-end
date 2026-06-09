// src/components/layout/Header.tsx
'use client';
import { Bell, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface HeaderProps { title?: string; }

export function Header({ title }: HeaderProps) {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 h-8 bg-muted/50 border-0 text-sm" placeholder="Search system..." />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.avatar ?? ''} />
            <AvatarFallback className="bg-violet-600 text-white text-xs">
              {user?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-medium">{user?.username}</p>
            <p className="text-[10px] text-violet-400 uppercase">
              {user?.role?.name ?? 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
