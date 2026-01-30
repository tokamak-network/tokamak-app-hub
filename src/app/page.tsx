import { Suspense } from 'react';
import { getApps } from '@/lib/apps';
import { AppListClient } from './app-list-client';
import { AppGridSkeleton } from '@/components/app';

export default function HomePage() {
  const apps = getApps();

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tokamak App Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover blockchain apps, SDKs, and tools built on Tokamak Network
        </p>
      </div>

      <Suspense fallback={<AppGridSkeleton />}>
        <AppListClient apps={apps} />
      </Suspense>
    </div>
  );
}
