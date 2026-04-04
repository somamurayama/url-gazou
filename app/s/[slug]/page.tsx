import type { Metadata } from "next";

const BASE_URL = "https://url-gazou.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

interface OgpPayload {
  t?: string; // title
  d?: string; // description
  i?: string; // image
  u?: string; // url
}

function decode(slug: string): OgpPayload {
  try {
    const json = Buffer.from(slug, "base64url").toString("utf-8");
    return JSON.parse(json) as OgpPayload;
  } catch {
    return {};
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = decode(slug);
  const title = d.t || "";
  const description = d.d || "";
  const image = d.i || "";
  const url = d.u || BASE_URL;

  return {
    title: title || "OGPプレビュー",
    description: description || undefined,
    openGraph: {
      title: title || "OGPプレビュー",
      description: description || undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "OGPプレビュー",
      description: description || undefined,
      images: image ? [image] : [],
    },
  };
}

export default async function ShortPage({ params }: Props) {
  const { slug } = await params;
  const d = decode(slug);
  const title = d.t || "";
  const description = d.d || "";
  const image = d.i || "";
  const url = d.u || "";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        {/* 画像メイン */}
        {image ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title || "OGP image"}
              className="w-full object-cover"
            />
            {/* タイトルオーバーレイ */}
            {(title || description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
                {title && (
                  <p className="text-white font-bold text-lg leading-tight">{title}</p>
                )}
                {description && (
                  <p className="text-white/80 text-sm mt-1 leading-snug">{description}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center gap-3 rounded-xl">
            {title && <p className="text-white font-bold text-xl text-center px-6">{title}</p>}
            {description && <p className="text-white/70 text-sm text-center px-6">{description}</p>}
            {!title && !description && (
              <p className="text-gray-500 text-sm">画像が設定されていません</p>
            )}
          </div>
        )}

        {/* 元URL遷移リンク（小さく） */}
        {url && (
          <div className="mt-3 text-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-2 transition"
            >
              元のページを開く
            </a>
          </div>
        )}

        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition">
            OGP確認・編集ツール
          </a>
        </div>
      </div>
    </div>
  );
}
