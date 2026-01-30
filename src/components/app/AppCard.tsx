'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import type { App } from '@/types/app';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/apps/${app.slug}`}>
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader className="pb-3 overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-lg">
                {app.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <h3 className="font-semibold text-base leading-tight truncate" title={app.name}>
                {app.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                by {app.author}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {app.shortDescription}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between">
          <CategoryBadge category={app.category} />
          {app.stars !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{app.stars.toLocaleString()}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
