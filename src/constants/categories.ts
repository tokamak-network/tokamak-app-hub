import type { AppCategory } from '@/types/app';

export interface CategoryInfo {
  value: AppCategory;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'dapp', label: 'dApps', description: 'Web3 Frontend Applications', icon: 'Globe' },
  { value: 'smart-contract', label: 'Smart Contracts', description: 'Solidity Packages & Contracts', icon: 'FileCode' },
  { value: 'sdk', label: 'SDKs', description: 'Libraries & SDKs', icon: 'Package' },
  { value: 'tool', label: 'Tools', description: 'CLI & Developer Tools', icon: 'Wrench' },
  { value: 'ai', label: 'AI', description: 'AI-Generated Applications', icon: 'Bot' },
  { value: 'other', label: 'Other', description: 'Miscellaneous', icon: 'MoreHorizontal' },
];

export const getCategoryInfo = (category: AppCategory): CategoryInfo | undefined => {
  return CATEGORIES.find(c => c.value === category);
};

export const getCategoryLabel = (category: AppCategory): string => {
  return getCategoryInfo(category)?.label ?? category;
};
