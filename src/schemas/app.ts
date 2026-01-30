import { z } from 'zod';

export const appCategorySchema = z.enum([
  'dapp',
  'smart-contract', 
  'sdk',
  'tool',
  'ai',
  'zk',
  'other'
]);

export const appStatusSchema = z.enum(['active', 'beta', 'deprecated']);

export const appSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(150),
  
  category: appCategorySchema,
  tags: z.array(z.string()).default([]),
  
  githubUrl: z.string().url().regex(/github\.com/),
  githubOwner: z.string().optional(),
  githubRepo: z.string().optional(),
  stars: z.number().int().min(0).optional(),
  forks: z.number().int().min(0).optional(),
  lastCommit: z.string().optional(),
  language: z.string().optional(),
  
  author: z.string().min(1),
  authorAvatar: z.string().url().optional(),
  logo: z.string().url().optional(),
  
  status: appStatusSchema.default('active'),
  featured: z.boolean().default(false),
  
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AppSchemaType = z.infer<typeof appSchema>;
export type AppCategoryType = z.infer<typeof appCategorySchema>;
