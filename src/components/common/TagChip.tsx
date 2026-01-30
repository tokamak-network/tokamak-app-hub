import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagChipProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function TagChip({ tag, onClick, active, className }: TagChipProps) {
  return (
    <Badge 
      variant={active ? 'default' : 'outline'}
      className={cn(
        'cursor-pointer transition-colors',
        onClick && 'hover:bg-primary hover:text-primary-foreground',
        className
      )}
      onClick={onClick}
    >
      {tag}
    </Badge>
  );
}
