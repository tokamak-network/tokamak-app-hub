'use client';

import { useState } from 'react';
import { ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!githubUrl) {
      setError('Please enter a GitHub URL first');
      return;
    }

    if (!isValidGitHubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate description');
        return;
      }

      setShortDescription(data.description);
    } catch {
      setError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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
            <div className="flex items-center justify-between">
              <label htmlFor="shortDescription" className="text-sm font-medium">
                Short Description <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !githubUrl}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="shortDescription"
              placeholder="Brief description of your app (max 100 chars)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={100}
              rows={2}
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
