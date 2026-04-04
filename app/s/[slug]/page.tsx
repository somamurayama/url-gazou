import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

interface OgpPage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  original_url: string;
}

async function fetchOgpPage(id: string): Promise<OgpPage | null> {
  const { data, error } = await getSupabase()
    .from("ogp_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as OgpPage;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchOgpPage(slug);

  if (!page) {
    return { title: "ページが見つかりません" };
  }

  return {
    title: page.title || "シェアページ",
    description: page.description || undefined,
    openGraph: {
      title: page.title || "シェアページ",
      description: page.description || undefined,
      images: page.image_url ? [{ url: page.image_url, width: 1200, height: 630 }] : [],
      url: `https://url-gazou.vercel.app/s/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title || "シェアページ",
      description: page.description || undefined,
      images: page.image_url ? [page.image_url] : [],
    },
  };
}

export default async function ShortPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchOgpPage(slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <p className="text-gray-500 text-sm">ページが見つかりません</p>
          <a href="/" className="text-blue-600 text-sm hover:underline">
            OGP確認・編集ツールに戻る
          </a>
        </div>
      </div>
    );
  }

  // original_urlがあればリダイレクト（クローラーはここに来る前にOGPタグを読む）
  if (page.original_url) {
    redirect(page.original_url);
  }

  // original_urlがない場合はシンプルな表示
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-lg">
        {page.image_url && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.image_url}
              alt={page.title || "OGP image"}
              className="w-full object-cover"
            />
            {(page.title || page.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
                {page.title && (
                  <p className="text-white font-bold text-lg leading-tight">{page.title}</p>
                )}
                {page.description && (
                  <p className="text-white/80 text-sm mt-1">{page.description}</p>
                )}
              </div>
            )}
          </div>
        )}
        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">
            OGP確認・編集ツール
          </a>
        </div>
      </div>
    </div>
  );
}
