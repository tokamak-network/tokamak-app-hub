import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">App Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The app you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Back to App Hub</Link>
      </Button>
    </div>
  );
}
