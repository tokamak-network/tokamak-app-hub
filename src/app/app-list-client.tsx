'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AppGrid } from '@/components/app';
import { SearchBar } from '@/components/search';
import { CategoryFilter, ActiveFilters } from '@/components/filter';
import { useAppFilter } from '@/hooks/useAppFilter';
import type { App } from '@/types/app';

interface AppListClientProps {
  apps: App[];
}

function AppListContent({ apps }: AppListClientProps) {
  const {
    search,
    setSearch,
    category,
    setCategory,
    filteredApps,
    clearSearch,
    clearCategory,
    clearAll,
  } = useAppFilter(apps);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="flex justify-center">
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <ActiveFilters
          search={search || undefined}
          category={category}
          onClearSearch={clearSearch}
          onClearCategory={clearCategory}
          onClearAll={clearAll}
        />
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'} found
      </div>

      <AppGrid apps={filteredApps} />
    </div>
  );
}

export function AppListClient({ apps }: AppListClientProps) {
  return (
    <NuqsAdapter>
      <AppListContent apps={apps} />
    </NuqsAdapter>
  );
}
