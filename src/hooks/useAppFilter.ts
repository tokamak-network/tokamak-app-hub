'use client';

import { useCallback, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import type { App, AppCategory } from '@/types/app';
import { filterApps } from '@/lib/search';

export function useAppFilter(apps: App[]) {
  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [category, setCategory] = useQueryState('category', { defaultValue: 'all' });

  const filteredApps = useMemo(() => {
    return filterApps(apps, {
      search: search || undefined,
      category: category || undefined,
    });
  }, [apps, search, category]);

  const clearSearch = useCallback(() => setSearch(''), [setSearch]);
  const clearCategory = useCallback(() => setCategory('all'), [setCategory]);
  const clearAll = useCallback(() => {
    setSearch('');
    setCategory('all');
  }, [setSearch, setCategory]);

  return {
    search,
    setSearch,
    category: category as AppCategory | 'all',
    setCategory: (value: AppCategory | 'all') => setCategory(value),
    filteredApps,
    clearSearch,
    clearCategory,
    clearAll,
  };
}
