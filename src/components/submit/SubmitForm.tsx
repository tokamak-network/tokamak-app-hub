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
  const [shortDescription, setShortDescription] = useState('');
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

    if (!shortDescription) {
      setError('Short description is required');
      return;
    }

    if (shortDescription.length > 100) {
      setError('Short description must be 100 characters or less');
      return;
    }

    const parsed = parseGitHubUrl(githubUrl);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    const issueUrl = generateIssueUrl({
      githubUrl,
      category,
      tags: tagList,
      shortDescription,
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
            <label htmlFor="shortDescription" className="text-sm font-medium">
              Short Description <span className="text-destructive">*</span>
            </label>
            <Input
              id="shortDescription"
              placeholder="Brief description of your app (max 100 chars)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">
              {shortDescription.length}/100
            </p>
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

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Submit App
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            After submitting, a maintainer will review and approve your app.
            Once approved, it will be automatically added to the hub.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
