'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReadmeSummaryProps {
  owner: string;
  repo: string;
}

export function ReadmeSummary({ owner, repo }: ReadmeSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/readme-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setHasAttempted(true);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          README Summary
        </h2>
        <div className="flex items-center gap-3 text-muted-foreground p-4 bg-muted/30 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating AI summary...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          README Summary
        </h2>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchSummary}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!summary && hasAttempted) {
    return null;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="border-t pt-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        README Summary
      </h2>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {summary.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
