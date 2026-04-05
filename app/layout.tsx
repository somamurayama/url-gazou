import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "リンクのサムネ・画像を変更するツール | URL画像設定",
  description:
    "リンクのサムネイル画像やタイトルを自由に変更できるツール。URLを入力するだけで簡単設定。",
  keywords: ["サムネイル変更", "リンク画像変更", "LINE サムネ", "Twitter カード", "OGP", "URLプレビュー画像"],
  openGraph: {
    title: "リンクのサムネ・画像を変更するツール",
    description:
      "リンクのサムネイル画像やタイトルを自由に変更できるツール。URLを入力するだけで簡単設定。",
    url: "https://url-gazou.vercel.app",
    siteName: "リンクのサムネ・画像を変更するツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "リンクのサムネ・画像を変更するツール",
    description:
      "リンクのサムネイル画像やタイトルを自由に変更できるツール。URLを入力するだけで簡単設定。",
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
