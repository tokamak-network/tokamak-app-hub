import { NextResponse } from "next/server";

const AI_API_URL = "https://api.ai.tokamak.network/v1/chat/completions";
const AI_MODEL = "qwen3-235b";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const aiApiKey = process.env.TOKAMAK_AI_API_KEY;

  if (!aiApiKey) {
    return NextResponse.json(
      { error: "AI API key not configured" },
      { status: 500 }
    );
  }

  let body: { githubUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { githubUrl } = body;

  if (!githubUrl) {
    return NextResponse.json(
      { error: "GitHub URL is required" },
      { status: 400 }
    );
  }

  const urlMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
  if (!urlMatch) {
    return NextResponse.json(
      { error: "Invalid GitHub URL format" },
      { status: 400 }
    );
  }

  const [, owner, repo] = urlMatch;
  const repoName = repo.replace(/\.git$/, "");

  let readmeContent = "";
  let repoDescription = "";
  let repoLanguage = "";
  let repoTopics: string[] = [];

  const githubHeaders: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "tokamak-app-hub",
  };

  const githubToken = process.env.GITHUB_ADMIN_TOKEN || process.env.GITHUB_TOKEN;
  if (githubToken && githubToken.startsWith("ghp_") && githubToken.length > 20) {
    githubHeaders.Authorization = `token ${githubToken}`;
  }

  try {
    const repoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
    const repoResponse = await fetch(repoUrl, {
      headers: githubHeaders,
      cache: "no-store",
    });

    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      repoDescription = repoData.description || "";
      repoLanguage = repoData.language || "";
      repoTopics = repoData.topics || [];
    }

    const readmeUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const readmeResponse = await fetch(readmeUrl, {
      headers: {
        ...githubHeaders,
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "no-store",
    });

    if (readmeResponse.ok) {
      readmeContent = await readmeResponse.text();
      readmeContent = readmeContent.substring(0, 3000);
    }
  } catch (error) {
    console.error("GitHub fetch error:", error);
  }

  if (!readmeContent && !repoDescription && !repoLanguage) {
    return NextResponse.json(
      {
        error:
          "Could not fetch repository information. The repository may be private or does not exist.",
      },
      { status: 404 }
    );
  }

  const prompt = `Analyze this software project and provide:
1. A short description (max 100 characters) explaining what the app does for users in simple terms. No technical jargon.
2. 3-5 relevant tags (lowercase, single words)

Repository: ${owner}/${repoName}
${repoLanguage ? `Language: ${repoLanguage}` : ""}
${repoDescription ? `Description: ${repoDescription}` : ""}
${readmeContent ? `README:\n${readmeContent}` : ""}

Respond in this exact JSON format only:
{"description": "your description here", "tags": ["tag1", "tag2", "tag3"]}`;

  try {
    const aiResponse = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3,
      }),
      cache: "no-store",
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || "";

    let description = "";
    let tags: string[] = [];

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        description = parsed.description || "";
        tags = Array.isArray(parsed.tags) ? parsed.tags : [];
      }
    } catch {
      description = content.replace(/^["']|["']$/g, "");
    }

    if (description.length > 100) {
      description = description.substring(0, 97) + "...";
    }

    tags = tags
      .map((t: string) => t.toLowerCase().replace(/[^a-z0-9-]/g, ""))
      .filter((t: string) => t.length > 0)
      .slice(0, 5);

    return NextResponse.json({ description, tags });
  } catch (error) {
    console.error("AI API request failed:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
