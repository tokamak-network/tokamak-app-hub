import type { App, AppCategory } from '@/types/app';
import { appSchema } from '@/schemas/app';
import fs from 'fs';
import path from 'path';

function loadAppsData(): App[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'apps.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8').trim();
    if (!fileContent) return [];
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getApps(): App[] {
  const appsData = loadAppsData();
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
  const appsData = loadAppsData();
  return appsData.map(app => app.slug);
}
