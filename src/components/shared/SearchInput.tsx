// src/components/shared/SearchInput.tsx
'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  defaultValue?: string;
}

export function SearchInput({ placeholder = 'Search...', onSearch, defaultValue = '' }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebouncedCallback(onSearch, 400);

  useEffect(() => {
    debounced(value);
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9 h-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
