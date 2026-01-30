import { NextResponse } from "next/server";

const AI_API_URL = "https://api.ai.tokamak.network/v1/chat/completions";
const AI_MODEL = "qwen3-80b-next";

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

  const prompt = `Based on the following GitHub repository information, generate a concise description in 100 characters or less. The description should clearly explain what this project does in a single sentence. Do not use markdown formatting. Do not include any thinking process or explanations.

Repository: ${owner}/${repoName}
${repoLanguage ? `Language: ${repoLanguage}` : ""}
${repoTopics.length > 0 ? `Topics: ${repoTopics.join(", ")}` : ""}
${repoDescription ? `Description: ${repoDescription}` : ""}
${readmeContent ? `README (truncated):\n${readmeContent}` : ""}

Output ONLY the short description, nothing else. No quotes. Keep it under 100 characters.`;

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
        max_tokens: 100,
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
    let description = aiData.choices?.[0]?.message?.content?.trim() || "";

    description = description.replace(/^["']|["']$/g, "");

    if (description.length > 100) {
      description = description.substring(0, 97) + "...";
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI API request failed:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
