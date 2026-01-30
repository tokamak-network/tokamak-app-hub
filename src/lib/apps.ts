import type { App, AppCategory } from '@/types/app';
import { appSchema } from '@/schemas/app';
import fs from 'fs';
import path from 'path';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/tokamak-network/tokamak-app-hub/main/data/apps.json';
const REVALIDATE_SECONDS = 300;

async function fetchAppsData(): Promise<App[]> {
  try {
    const response = await fetch(GITHUB_RAW_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub fetch failed: ${response.status}`);
    }
    
    return await response.json() as App[];
  } catch (error) {
    console.warn('Failed to fetch apps from GitHub, falling back to local file:', error);
    return loadAppsDataLocal();
  }
}

function loadAppsDataLocal(): App[] {
  const filePath = path.join(process.cwd(), 'data', 'apps.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as App[];
}

function loadAppsDataSync(): App[] {
  return loadAppsDataLocal();
}

export async function getApps(): Promise<App[]> {
  const appsData = await fetchAppsData();
  return appsData.map(app => appSchema.parse(app));
}

export async function getAppBySlug(slug: string): Promise<App | undefined> {
  const apps = await getApps();
  return apps.find(app => app.slug === slug);
}

export async function getAppsByCategory(category: AppCategory | 'all'): Promise<App[]> {
  const apps = await getApps();
  if (category === 'all') return apps;
  return apps.filter(app => app.category === category);
}

export async function getFeaturedApps(): Promise<App[]> {
  const apps = await getApps();
  return apps.filter(app => app.featured);
}

export async function getAllTags(): Promise<string[]> {
  const apps = await getApps();
  const tagSet = new Set<string>();
  apps.forEach(app => app.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getAppSlugs(): string[] {
  const appsData = loadAppsDataSync();
  return appsData.map(app => app.slug);
}
