'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AppCategory } from '@/types/app';
import { getCategoryLabel } from '@/constants/categories';

interface ActiveFiltersProps {
  search?: string;
  category?: AppCategory | 'all';
  tags?: string[];
  onClearSearch?: () => void;
  onClearCategory?: () => void;
  onRemoveTag?: (tag: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilters({
  search,
  category,
  tags = [],
  onClearSearch,
  onClearCategory,
  onRemoveTag,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters = search || (category && category !== 'all') || tags.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {search && (
        <Badge variant="secondary" className="gap-1">
          Search: {search}
          <button onClick={onClearSearch} className="ml-1 hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {category && category !== 'all' && (
        <Badge variant="secondary" className="gap-1">
          {getCategoryLabel(category)}
          <button onClick={onClearCategory} className="ml-1 hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button onClick={() => onRemoveTag?.(tag)} className="ml-1 hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 px-2 text-xs">
          Clear all
        </Button>
      )}
    </div>
  );
}
