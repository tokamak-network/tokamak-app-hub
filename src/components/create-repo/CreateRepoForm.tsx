"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Github, LogOut, FolderPlus, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreateResult {
  success: boolean;
  repository?: {
    name: string;
    fullName: string;
    url: string;
    cloneUrl: string;
  };
  message?: string;
  error?: string;
}

export function CreateRepoForm() {
  const { data: session, status } = useSession();
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CreateResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!repoName.trim()) {
      setError("Repository name is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, description, isPrivate }),
      });

      const data: CreateResult = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create repository");
        return;
      }

      setResult(data);
      setRepoName("");
      setDescription("");
      setIsPrivate(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Repository</CardTitle>
          <CardDescription>
            Sign in with GitHub to create a repository in the Tokamak Network
            organization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <p className="text-muted-foreground text-center">
            You need to sign in with your GitHub account to create repositories.
            Only authorized users can create repositories.
          </p>
          <Button onClick={() => signIn("github")} size="lg">
            <Github className="h-5 w-5 mr-2" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (result?.success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6" />
            Repository Created
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <p className="font-medium">{result.repository?.fullName}</p>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={result.repository?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on GitHub &rarr;
            </a>
            <code className="text-xs bg-muted p-2 rounded block">
              git clone {result.repository?.cloneUrl}
            </code>
          </div>
          <Button onClick={() => setResult(null)} variant="outline">
            Create Another Repository
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create Repository</CardTitle>
            <CardDescription>
              Create a new repository in tokamak-network organization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {session.user?.username || session.user?.name}
            </span>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="repoName" className="text-sm font-medium">
              Repository Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="repoName"
              placeholder="my-awesome-project"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Will be created as tokamak-network/{repoName || "repo-name"}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="description"
              placeholder="A brief description of your project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isPrivate" className="text-sm">
              Make this repository private
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Repository
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            A repository will be created in the tokamak-network organization and
            you will be invited as a collaborator with write access.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
