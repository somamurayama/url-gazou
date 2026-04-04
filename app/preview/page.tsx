import type { Metadata } from "next";

const BASE_URL = "https://url-gazou.vercel.app";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const title = typeof params.title === "string" ? params.title : "";
  const description = typeof params.description === "string" ? params.description : "";
  const image = typeof params.image === "string" ? params.image : "";
  const url = typeof params.url === "string" ? params.url : BASE_URL;

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

export default async function PreviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const title = typeof params.title === "string" ? params.title : "";
  const description = typeof params.description === "string" ? params.description : "";
  const image = typeof params.image === "string" ? params.image : "";
  const url = typeof params.url === "string" ? params.url : "";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-lg w-full overflow-hidden">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || "OGP image"}
            className="w-full aspect-video object-cover"
          />
        )}
        <div className="p-6 space-y-3">
          {title && (
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}
          {url && (
            <p className="text-xs text-gray-400 truncate">{url}</p>
          )}
          {!title && !description && !image && (
            <p className="text-sm text-gray-400 text-center py-4">OGPデータが設定されていません</p>
          )}
        </div>
        <div className="px-6 pb-6">
          <a
            href="/"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            OGP確認・編集ツールに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
