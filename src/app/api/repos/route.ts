import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Octokit } from "@octokit/rest";

const ORG_NAME = "tokamak-network";

const RESERVED_NAMES = [
  ".github",
  ".git",
  ".gitignore",
  ".gitattributes",
  "api",
  "admin",
  "help",
  "login",
  "logout",
  "settings",
  "tokamak-network",
  "null",
  "undefined",
  "true",
  "false",
];

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(username: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(username);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(username, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: userLimit.resetTime - now };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - userLimit.count, resetIn: userLimit.resetTime - now };
}

function getAllowedUsers(): string[] {
  const envUsers = process.env.ALLOWED_USERS;
  if (!envUsers) return [];
  return envUsers.split(",").map((u) => u.trim()).filter(Boolean);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.username) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in with GitHub." },
      { status: 401 }
    );
  }

  const username = session.user.username;
  const allowedUsers = getAllowedUsers();

  if (allowedUsers.length === 0) {
    return NextResponse.json(
      { error: "Server configuration error: No allowed users configured." },
      { status: 500 }
    );
  }

  if (!allowedUsers.includes(username)) {
    return NextResponse.json(
      { error: "You are not authorized to create repositories." },
      { status: 403 }
    );
  }

  const rateLimit = checkRateLimit(username);
  if (!rateLimit.allowed) {
    const resetMinutes = Math.ceil(rateLimit.resetIn / 60000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${resetMinutes} minutes.` },
      { status: 429 }
    );
  }

  const adminToken = process.env.GITHUB_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      { error: "Server configuration error: Admin token not set." },
      { status: 500 }
    );
  }

  let body: { repoName?: string; description?: string; isPrivate?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { repoName, description = "", isPrivate = false } = body;

  if (!repoName || typeof repoName !== "string") {
    return NextResponse.json(
      { error: "Repository name is required." },
      { status: 400 }
    );
  }

  const sanitizedRepoName = repoName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (sanitizedRepoName.length < 1 || sanitizedRepoName.length > 100) {
    return NextResponse.json(
      { error: "Repository name must be between 1 and 100 characters." },
      { status: 400 }
    );
  }

  if (RESERVED_NAMES.includes(sanitizedRepoName)) {
    return NextResponse.json(
      { error: "This repository name is reserved and cannot be used." },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: adminToken });

  try {
    const { data: repo } = await octokit.repos.createInOrg({
      org: ORG_NAME,
      name: sanitizedRepoName,
      description,
      private: isPrivate,
      auto_init: true,
    });

    await octokit.repos.addCollaborator({
      owner: ORG_NAME,
      repo: sanitizedRepoName,
      username,
      permission: "push",
    });

    return NextResponse.json({
      success: true,
      repository: {
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        cloneUrl: repo.clone_url,
      },
      message: `Repository created and you have been invited as a collaborator with write access.`,
    });
  } catch (error) {
    const githubError = error as { status?: number; message?: string };

    if (githubError.status === 422) {
      return NextResponse.json(
        { error: "Repository name already exists in the organization." },
        { status: 409 }
      );
    }

    console.error("GitHub API Error:", error);
    return NextResponse.json(
      { error: "Failed to create repository. Please try again later." },
      { status: 500 }
    );
  }
}
