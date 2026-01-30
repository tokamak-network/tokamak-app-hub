import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

export interface RepoInfo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  defaultBranch: string;
  owner: {
    login: string;
    avatar: string;
  };
}

export async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null> {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
      defaultBranch: data.default_branch,
      owner: {
        login: data.owner.login,
        avatar: data.owner.avatar_url,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch repo: ${owner}/${repo}`, error);
    return null;
  }
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  return { 
    owner: match[1], 
    repo: match[2].replace(/\.git$/, '') 
  };
}
