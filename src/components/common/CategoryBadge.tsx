import { Badge } from '@/components/ui/badge';
import type { AppCategory } from '@/types/app';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: AppCategory;
  className?: string;
}

const categoryColors: Record<AppCategory, string> = {
  'dapp': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'smart-contract': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'sdk': 'bg-green-100 text-green-800 hover:bg-green-200',
  'tool': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  'backend': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'ai': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  'other': 'bg-slate-100 text-slate-800 hover:bg-slate-200',
};

const categoryLabels: Record<AppCategory, string> = {
  'dapp': 'dApp',
  'smart-contract': 'Smart Contract',
  'sdk': 'SDK',
  'tool': 'Tool',
  'backend': 'Backend',
  'ai': 'AI',
  'other': 'Other',
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn(categoryColors[category], 'font-medium', className)}
    >
      {categoryLabels[category]}
    </Badge>
  );
}
