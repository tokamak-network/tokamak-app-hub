import type { App, AppCategory } from '@/types/app';
import { appSchema } from '@/schemas/app';
import appsData from '../../data/apps.json';

export function getApps(): App[] {
  return appsData.map(app => appSchema.parse(app));
}

export function getAppBySlug(slug: string): App | undefined {
  const apps = getApps();
  return apps.find(app => app.slug === slug);
}

export function getAppsByCategory(category: AppCategory | 'all'): App[] {
  const apps = getApps();
  if (category === 'all') return apps;
  return apps.filter(app => app.category === category);
}

export function getFeaturedApps(): App[] {
  const apps = getApps();
  return apps.filter(app => app.featured);
}

export function getAllTags(): string[] {
  const apps = getApps();
  const tagSet = new Set<string>();
  apps.forEach(app => app.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getAppSlugs(): string[] {
  return appsData.map(app => app.slug);
}
