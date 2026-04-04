"use client";

import { useState } from "react";
import OgpForm from "@/components/OgpForm";
import PreviewCard from "@/components/PreviewCard";
import ImageUploader from "@/components/ImageUploader";
import type { OgpData } from "@/app/api/ogp/route";

const defaultOgpData: OgpData = {
  title: "",
  description: "",
  image: "",
  url: "",
};

export default function Home() {
  const [ogpData, setOgpData] = useState<OgpData>(defaultOgpData);

  const handleImageUpload = (url: string) => {
    setOgpData((prev) => ({ ...prev, image: url }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
            OGP
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              OGP確認・編集ツール
            </h1>
            <p className="text-xs text-gray-500">URLからOGPメタデータを取得・編集</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ヒーロー */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            OGPメタデータを確認・編集
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            URLを入力してOGPタグを取得。内容を編集して X・Facebook・LINE の
            シェアプレビューをリアルタイムで確認できます。
          </p>
        </div>

        {/* AdSense プレースホルダー（上部） */}
        {/* <div className="mb-8 flex justify-center">
          <ins className="adsbygoogle" style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true" />
        </div> */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 左カラム：フォーム + 画像アップロード */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                URLを入力してOGPを取得・編集
              </h3>
              <OgpForm ogpData={ogpData} onChange={setOgpData} />
            </section>

            <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">2</span>
                OGP画像をアップロード
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                画像をアップロードすると og:image に自動セットされます
              </p>
              <ImageUploader onUpload={handleImageUpload} />
            </section>
          </div>

          {/* 右カラム：プレビュー */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">3</span>
                シェアプレビュー
              </h3>
              <PreviewCard ogpData={ogpData} />
            </section>

            {/* AdSense プレースホルダー（サイドバー） */}
            {/* <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 flex items-center justify-center min-h-[250px]">
              <ins className="adsbygoogle" style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto" />
            </div> */}
          </div>
        </div>

        {/* 使い方セクション */}
        <section className="mt-12 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">使い方</h3>
          <ol className="space-y-3">
            {[
              "確認したいページのURLを入力して「OGP取得」ボタンをクリック",
              "取得したタイトル・説明文・画像URLを自由に編集",
              "必要に応じて「OGP画像をアップロード」から画像を差し替え",
              "X・Facebook・LINEのプレビューを切り替えて表示を確認",
              "「コピー」ボタンで生成されたOGPタグをHTML内に貼り付け",
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* フッター */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-400">
          <p>OGP確認・編集ツール</p>
          <p className="mt-1">
            OGP（Open Graph Protocol）メタタグの確認・編集・プレビューツール
          </p>
        </div>
      </footer>
    </div>
  );
}
