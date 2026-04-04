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
  const [copiedShare, setCopiedShare] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/ogp?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "OGPの取得に失敗しました");
        return;
      }

      onChange(data as OgpData);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OgpData, value: string) => {
    onChange({ ...ogpData, [field]: value });
  };

  const generateMetaTags = () => {
    return `<!-- OGP Meta Tags -->
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
  };

  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const generateShareUrl = () => {
    const base = "https://url-gazou.vercel.app/preview";
    const params = new URLSearchParams();
    if (ogpData.title) params.set("title", ogpData.title);
    if (ogpData.description) params.set("description", ogpData.description);
    if (ogpData.image) params.set("image", ogpData.image);
    if (ogpData.url) params.set("url", ogpData.url);
    return `${base}?${params.toString()}`;
  };

  const handleCopyShare = async () => {
    const shareUrl = generateShareUrl();
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTags());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = generateMetaTags();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            og:title
          </label>
          <input
            type="text"
            value={ogpData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="ページタイトル"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            og:description
          </label>
          <textarea
            value={ogpData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="ページの説明文"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            og:image
          </label>
          <input
            type="url"
            value={ogpData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            og:url
          </label>
          <input
            type="url"
            value={ogpData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
      </div>

      {/* シェアURL */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-blue-800">サムネ付きシェアURL</p>
          <button
            onClick={handleCopyShare}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-sm font-medium text-white transition"
          >
            {copiedShare ? "コピー完了!" : "URLをコピー"}
          </button>
        </div>
        <p className="text-xs text-blue-600 break-all font-mono">{generateShareUrl()}</p>
        <p className="text-xs text-blue-500">
          このURLをSNSに貼ると、設定した画像・タイトルがサムネとして表示されます
        </p>
      </div>

      {/* OGPタグ出力 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            生成されたOGPタグ
          </label>
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
