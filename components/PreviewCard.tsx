"use client";

import { useState } from "react";
import Image from "next/image";
import type { OgpData } from "@/app/api/ogp/route";

type Platform = "twitter" | "facebook" | "line";

interface PreviewCardProps {
  ogpData: OgpData;
}

export default function PreviewCard({ ogpData }: PreviewCardProps) {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [imgError, setImgError] = useState(false);

  const hostname = (() => {
    try {
      return new URL(ogpData.url || "https://example.com").hostname;
    } catch {
      return ogpData.url || "example.com";
    }
  })();

  const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + "…" : str;

  const platforms: { id: Platform; label: string }[] = [
    { id: "twitter", label: "X (Twitter)" },
    { id: "facebook", label: "Facebook" },
    { id: "line", label: "LINE" },
  ];

  const ImagePlaceholder = ({ className }: { className?: string }) => (
    <div
      className={`bg-gray-200 flex items-center justify-center text-gray-400 text-xs ${className ?? ""}`}
    >
      画像なし
    </div>
  );

  const OgpImage = ({ className, aspectClass }: { className?: string; aspectClass?: string }) => {
    if (!ogpData.image || imgError) {
      return <ImagePlaceholder className={`${aspectClass ?? "aspect-video"} w-full ${className ?? ""}`} />;
    }
    return (
      <div className={`relative ${aspectClass ?? "aspect-video"} w-full overflow-hidden ${className ?? ""}`}>
        <Image
          src={ogpData.image}
          alt={ogpData.title || "OGP image"}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      </div>
    );
  };

  // プラットフォーム変更時に画像エラーをリセット
  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setImgError(false);
  };

  return (
    <div className="space-y-4">
      {/* プラットフォーム切り替え */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {platforms.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handlePlatformChange(id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              platform === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* X (Twitter) カード */}
      {platform === "twitter" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white max-w-[504px] mx-auto shadow-sm">
          <OgpImage />
          <div className="px-3 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">{hostname}</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {truncate(ogpData.title || "タイトルなし", 70)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              {truncate(ogpData.description || "説明なし", 125)}
            </p>
          </div>
        </div>
      )}

      {/* Facebook カード */}
      {platform === "facebook" && (
        <div className="border border-gray-300 overflow-hidden bg-white max-w-[476px] mx-auto">
          <OgpImage />
          <div className="px-3 py-2 bg-[#f2f3f5] border-t border-gray-300">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{hostname}</p>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {truncate(ogpData.title || "タイトルなし", 80)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              {truncate(ogpData.description || "説明なし", 100)}
            </p>
          </div>
        </div>
      )}

      {/* LINE カード */}
      {platform === "line" && (
        <div className="max-w-[300px] mx-auto">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <OgpImage aspectClass="aspect-[1.91/1]" />
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {truncate(ogpData.title || "タイトルなし", 50)}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                {truncate(ogpData.description || "説明なし", 80)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{hostname}</p>
            </div>
          </div>
        </div>
      )}

      {/* 凡例 */}
      <p className="text-xs text-gray-400 text-center">
        ※ 実際の表示はプラットフォームにより異なる場合があります
      </p>
    </div>
  );
}
