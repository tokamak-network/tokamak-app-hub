import Fuse, { type IFuseOptions } from 'fuse.js';
import type { App } from '@/types/app';

const fuseOptions: IFuseOptions<App> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'shortDescription', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export function searchApps(apps: App[], query: string): App[] {
  if (!query.trim()) return apps;
  
  const fuse = new Fuse(apps, fuseOptions);
  const results = fuse.search(query);
  return results.map((result) => result.item);
}

export function filterApps(
  apps: App[],
  options: {
    search?: string;
    category?: string;
    tags?: string[];
  }
): App[] {
  let filtered = apps;

  if (options.category && options.category !== 'all') {
    filtered = filtered.filter((app) => app.category === options.category);
  }

  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter((app) =>
      options.tags!.some((tag) => app.tags.includes(tag))
    );
  }

  if (options.search) {
    filtered = searchApps(filtered, options.search);
  }

  return filtered;
}
