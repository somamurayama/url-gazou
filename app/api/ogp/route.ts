import { NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";

export interface OgpData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URLが指定されていません" }, { status: 400 });
  }

  // URLバリデーション
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "http または https の URL を指定してください" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGPChecker/1.0; +https://url-gazou.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `ページの取得に失敗しました (HTTP ${response.status})` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "HTMLページではありません" },
        { status: 422 }
      );
    }

    const html = await response.text();
    const root = parse(html);

    const getMeta = (property: string): string => {
      const byProperty =
        root.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ?? "";
      if (byProperty) return byProperty;
      const byName =
        root.querySelector(`meta[name="${property}"]`)?.getAttribute("content") ?? "";
      return byName;
    };

    const ogpData: OgpData = {
      title:
        getMeta("og:title") ||
        root.querySelector("title")?.text ||
        "",
      description:
        getMeta("og:description") ||
        getMeta("description") ||
        "",
      image: getMeta("og:image"),
      url: getMeta("og:url") || parsedUrl.toString(),
    };

    return NextResponse.json(ogpData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    if (message.includes("timeout") || message.includes("TimeoutError")) {
      return NextResponse.json(
        { error: "リクエストがタイムアウトしました。時間をおいて再試行してください。" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: `OGP取得中にエラーが発生しました: ${message}` },
      { status: 500 }
    );
  }
}
