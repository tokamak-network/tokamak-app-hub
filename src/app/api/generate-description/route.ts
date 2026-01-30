import { NextResponse } from "next/server";

const AI_API_URL = "https://api.ai.tokamak.network/v1/chat/completions";
const AI_MODEL = "qwen3-80b-next";

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
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
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

  try {
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      repoDescription = repoData.description || "";
    }

    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (readmeResponse.ok) {
      readmeContent = await readmeResponse.text();
      readmeContent = readmeContent.substring(0, 3000);
    }
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
  }

  if (!readmeContent && !repoDescription) {
    return NextResponse.json(
      { error: "Could not fetch repository information" },
      { status: 404 }
    );
  }

  const prompt = `Based on the following GitHub repository information, generate a concise description in 100 characters or less. The description should clearly explain what this project does in a single sentence. Do not use markdown formatting.

Repository: ${owner}/${repoName}
${repoDescription ? `Description: ${repoDescription}` : ""}
${readmeContent ? `README (truncated):\n${readmeContent}` : ""}

Generate only the short description, nothing else. Keep it under 100 characters.`;

  try {
    const aiResponse = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
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
