export interface App {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  
  category: AppCategory;
  tags: string[];
  
  githubUrl: string;
  githubOwner?: string;
  githubRepo?: string;
  stars?: number;
  forks?: number;
  lastCommit?: string;
  language?: string;
  
  author: string;
  authorAvatar?: string;
  logo?: string;
  
  status: AppStatus;
  featured: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export type AppCategory = 
  | 'dapp'
  | 'smart-contract'
  | 'sdk'
  | 'tool'
  | 'ai'
  | 'zk'
  | 'other';

export type AppStatus = 'active' | 'beta' | 'deprecated';
