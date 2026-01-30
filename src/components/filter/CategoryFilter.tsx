'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES } from '@/constants/categories';
import type { AppCategory } from '@/types/app';

interface CategoryFilterProps {
  value: AppCategory | 'all';
  onChange: (value: AppCategory | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as AppCategory | 'all')}>
      <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          All
        </TabsTrigger>
        {CATEGORIES.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
