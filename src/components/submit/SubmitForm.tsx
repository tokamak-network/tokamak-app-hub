'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/constants/categories';
import { generateIssueUrl, isValidGitHubUrl, parseGitHubUrl } from '@/lib/github-issue';

export function SubmitForm() {
  const [githubUrl, setGithubUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!githubUrl) {
      setError('GitHub URL is required');
      return;
    }

    if (!isValidGitHubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    const parsed = parseGitHubUrl(githubUrl);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    const issueUrl = generateIssueUrl({
      githubUrl,
      category,
      tags: tagList,
      notes: notes || undefined,
      repoName: parsed?.repo,
    });

    window.open(issueUrl, '_blank');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a New App</CardTitle>
        <CardDescription>
          Share your blockchain app with the Tokamak community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="githubUrl" className="text-sm font-medium">
              GitHub Repository URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/owner/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags <span className="text-muted-foreground">(optional, comma separated)</span>
            </label>
            <Input
              id="tags"
              placeholder="typescript, web3, defi"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional Notes <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="notes"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any additional information about your app..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Submit App
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Submitting will redirect you to create a GitHub Issue.
            A maintainer will review and add your app to the hub.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
