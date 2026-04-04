"use client";

import { useState } from "react";
import type { OgpData } from "@/app/api/ogp/route";

interface OgpFormProps {
  ogpData: OgpData;
  onChange: (data: OgpData) => void;
}

export default function OgpForm({ ogpData, onChange }: OgpFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/ogp?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "OGPの取得に失敗しました"); return; }
      onChange(data as OgpData);
      setShareUrl(""); // OGP変更時はシェアURLをリセット
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OgpData, value: string) => {
    onChange({ ...ogpData, [field]: value });
    setShareUrl(""); // 編集したらリセット
  };

  const handleGenerateShareUrl = async () => {
    setShareLoading(true);
    setShareError("");
    try {
      const res = await fetch("/api/save-ogp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ogpData.title,
          description: ogpData.description,
          image_url: ogpData.image,
          original_url: ogpData.url,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setShareError(data.error || "URL生成に失敗しました"); return; }
      setShareUrl(data.url);
    } catch {
      setShareError("ネットワークエラーが発生しました");
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const generateMetaTags = () => `<!-- OGP Meta Tags -->
<meta property="og:title" content="${escapeHtml(ogpData.title)}" />
<meta property="og:description" content="${escapeHtml(ogpData.description)}" />
<meta property="og:image" content="${escapeHtml(ogpData.image)}" />
<meta property="og:url" content="${escapeHtml(ogpData.url)}" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(ogpData.title)}" />
<meta name="twitter:description" content="${escapeHtml(ogpData.description)}" />
<meta name="twitter:image" content="${escapeHtml(ogpData.image)}" />`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTags());
    } catch {
      const ta = document.createElement("textarea");
      ta.value = generateMetaTags();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* URL入力 */}
      <form onSubmit={handleFetch} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "取得中..." : "OGP取得"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 編集フォーム */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">og:title</label>
          <input
            type="text"
            value={ogpData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="ページタイトル"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">og:description</label>
          <textarea
            value={ogpData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="ページの説明文"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">og:image</label>
          <input
            type="url"
            value={ogpData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">og:url（元のURL）</label>
          <input
            type="url"
            value={ogpData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
      </div>

      {/* シェアURL生成 */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">サムネ付きシェアURL</p>
            <p className="text-xs text-blue-500 mt-0.5">
              SNSに貼ると画像・タイトルがサムネとして表示されます
            </p>
          </div>
          <button
            onClick={handleGenerateShareUrl}
            disabled={shareLoading || (!ogpData.title && !ogpData.image)}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition whitespace-nowrap"
          >
            {shareLoading ? "生成中..." : "URLを生成"}
          </button>
        </div>

        {shareError && (
          <p className="text-xs text-red-600">{shareError}</p>
        )}

        {shareUrl && (
          <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 px-3 py-2">
            <span className="flex-1 text-sm text-blue-700 font-mono truncate">{shareUrl}</span>
            <button
              onClick={handleCopyShare}
              className="flex-shrink-0 rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs font-medium text-white transition"
            >
              {copiedShare ? "コピー完了!" : "コピー"}
            </button>
          </div>
        )}
      </div>

      {/* OGPタグ出力 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">生成されたOGPタグ</label>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition"
          >
            {copied ? "コピー完了!" : "コピー"}
          </button>
        </div>
        <pre className="rounded-lg bg-gray-900 text-green-400 text-xs p-4 overflow-x-auto whitespace-pre-wrap font-mono">
          {generateMetaTags()}
        </pre>
      </div>
    </div>
  );
}
