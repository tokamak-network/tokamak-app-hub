import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Star, GitFork, Calendar, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import { TagChip } from '@/components/common/TagChip';
import { getAppBySlug, getAppSlugs } from '@/lib/apps';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAppSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  
  if (!app) {
    return { title: 'App Not Found' };
  }
  
  return {
    title: `${app.name} - Tokamak App Hub`,
    description: app.shortDescription,
  };
}

export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const stats = [
    { icon: Star, label: 'Stars', value: app.stars?.toLocaleString() ?? 'N/A' },
    { icon: GitFork, label: 'Forks', value: app.forks?.toLocaleString() ?? 'N/A' },
    { icon: Calendar, label: 'Updated', value: app.lastCommit ? new Date(app.lastCommit).toLocaleDateString() : 'N/A' },
    { icon: Code, label: 'Language', value: app.language ?? 'N/A' },
  ];

  return (
    <div className="container py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Apps
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-2xl">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{app.name}</h1>
                <p className="text-muted-foreground">by {app.author}</p>
              </div>
            </div>
            <Button asChild>
              <a href={app.githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg">{app.shortDescription}</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <CategoryBadge category={app.category} />
          </div>

          {app.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Tags:</span>
              {app.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{app.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
