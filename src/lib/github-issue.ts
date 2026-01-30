const REPO_OWNER = 'tokamak-network';
const REPO_NAME = 'tokamak-app-hub';

interface SubmissionData {
  githubUrl: string;
  category: string;
  tags: string[];
  notes?: string;
  repoName?: string;
}

export function generateIssueUrl(data: SubmissionData): string {
  const title = `App Submission: ${data.repoName || 'New App'}`;
  
  const body = `## App Submission Request

### GitHub Repository
${data.githubUrl}

### Category
${data.category}

### Tags
${data.tags.length > 0 ? data.tags.join(', ') : 'None specified'}

### Additional Notes
${data.notes || 'None'}

---
*This issue was created via the Tokamak App Hub submission form.*
`;

  const params = new URLSearchParams({
    title,
    body,
    labels: 'app-submission',
  });

  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?${params.toString()}`;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  return { 
    owner: match[1], 
    repo: match[2].replace(/\.git$/, '') 
  };
}

export function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/.test(url);
}
