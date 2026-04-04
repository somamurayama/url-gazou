import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OGP確認・編集ツール | URLからOGPメタデータを取得・編集",
  description:
    "URLを入力するだけでOGP（Open Graph Protocol）メタデータを取得・編集できるツール。X(Twitter)・Facebook・LINEのプレビューカードをリアルタイムで確認し、画像アップロードやメタタグのコピーも可能。",
  keywords: ["OGP", "Open Graph", "SEO", "メタタグ", "OGP確認", "OGP編集"],
  openGraph: {
    title: "OGP確認・編集ツール",
    description:
      "URLを入力してOGPメタデータを取得・編集。X・Facebook・LINEのプレビューをリアルタイム確認。",
    url: "https://url-gazou.vercel.app",
    siteName: "OGP確認・編集ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OGP確認・編集ツール",
    description:
      "URLを入力してOGPメタデータを取得・編集。X・Facebook・LINEのプレビューをリアルタイム確認。",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "VkyFE94HKwehxxWQv6SjUgm4dz56cswXnKXvIGSA8xI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        {/* AdSense placeholder - コメントを外してパブリッシャーIDを置き換えてください */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        /> */}
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
