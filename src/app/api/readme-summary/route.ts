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

  let body: { owner?: string; repo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "owner and repo are required" },
      { status: 400 }
    );
  }

  const githubHeaders: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "tokamak-app-hub",
  };

  const githubToken = process.env.GITHUB_ADMIN_TOKEN || process.env.GITHUB_TOKEN;
  if (githubToken && githubToken.startsWith("ghp_") && githubToken.length > 20) {
    githubHeaders.Authorization = `token ${githubToken}`;
  }

  let readmeContent = "";

  try {
    const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const readmeResponse = await fetch(readmeUrl, {
      headers: {
        ...githubHeaders,
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "no-store",
    });

    if (!readmeResponse.ok) {
      return NextResponse.json(
        { error: "README not found" },
        { status: 404 }
      );
    }

    readmeContent = await readmeResponse.text();
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch README" },
      { status: 500 }
    );
  }

  const truncatedReadme = readmeContent.substring(0, 8000);

  const prompt = `Summarize this GitHub README in 2-3 concise paragraphs. Focus on:
1. What the project does (main purpose)
2. Key features or capabilities  
3. Who it's for or how to use it

Keep the summary informative but brief (150-250 words total). Use plain language, avoid marketing speak.

README:
${truncatedReadme}

Respond with only the summary text, no headers or formatting.`;

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
        max_tokens: 500,
        temperature: 0.3,
      }),
      cache: "no-store",
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content?.trim() || "";

    if (!summary) {
      return NextResponse.json(
        { error: "Empty summary generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI API request failed:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
