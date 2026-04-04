# OGP確認・編集ツール

URLを入力するだけでOGP（Open Graph Protocol）メタデータを取得・編集できるWebアプリです。
X(Twitter)・Facebook・LINEのシェアプレビューをリアルタイムで確認でき、画像アップロードやメタタグのコピーも可能です。

## 機能

- **OGP取得**: URLからog:title / og:description / og:image / og:urlを自動抽出
- **リアルタイム編集**: フォームで編集した内容がプレビューに即反映
- **マルチプラットフォームプレビュー**: X(Twitter) / Facebook / LINE のカード表示を切り替え
- **画像アップロード**: Cloudinary経由でog:imageを差し替え
- **OGPタグ出力**: 編集後のmetaタグHTMLをワンクリックでコピー
- **SEO対応**: sitemap.xml・robots.txt自動生成
- **AdSense対応**: スクリプト差し込み箇所をコメントで用意済み

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/) (画像アップロード)
- [node-html-parser](https://github.com/taoqf/node-html-parser) (HTMLパース)
- [Vercel](https://vercel.com/) (デプロイ)

---

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <your-repo-url>
cd url-gazou
npm install
```

### 2. Cloudinaryのセットアップ

1. [Cloudinary](https://cloudinary.com/) にサインアップ（無料プランあり）
2. ダッシュボードの **Dashboard** から `Cloud Name` を確認
3. **Settings > Upload** に移動し、**Upload presets** セクションで `Add upload preset` をクリック
4. `Signing Mode` を **Unsigned** に設定し、プリセット名（例: `ogp_checker`）をメモ
5. 保存

### 3. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、Cloudinaryの値を入力します。

```bash
cp .env.example .env.local
```

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name      # ダッシュボードのCloud Name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset # 作成したUpload Preset名
```

### 4. ローカル起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## Vercelへのデプロイ手順

### 方法1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

デプロイ後、環境変数を追加します：

```bash
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_UPLOAD_PRESET
```

再デプロイ：

```bash
vercel --prod
```

### 方法2: Vercel ダッシュボード（推奨）

1. [Vercel](https://vercel.com/) にサインイン
2. **New Project** → GitHubリポジトリをインポート
3. **Environment Variables** に以下を追加：
   - `CLOUDINARY_CLOUD_NAME`: CloudinaryのCloud Name
   - `CLOUDINARY_UPLOAD_PRESET`: Upload Preset名
4. **Deploy** をクリック

---

## AdSenseの設置

`app/layout.tsx` のコメントアウトされたscriptタグを有効にし、`ca-pub-XXXXXXXXXXXXXXXX` を実際のパブリッシャーIDに置き換えてください。

```tsx
// app/layout.tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
/>
```

広告ユニットは `app/page.tsx` 内のコメントアウトされた `<ins>` タグを参考に配置してください。

---

## ディレクトリ構成

```
url-gazou/
├── app/
│   ├── layout.tsx          # SEOメタ・AdSenseスクリプト
│   ├── page.tsx            # メインページ
│   ├── sitemap.ts          # sitemap.xml 自動生成
│   ├── robots.ts           # robots.txt 自動生成
│   └── api/
│       ├── ogp/route.ts    # OGP取得APIエンドポイント
│       └── upload/route.ts # Cloudinary画像アップロードエンドポイント
├── components/
│   ├── OgpForm.tsx         # URL入力・OGP編集フォーム・タグ出力
│   ├── PreviewCard.tsx     # X/Facebook/LINEプレビューカード
│   └── ImageUploader.tsx   # 画像アップロードUI
├── .env.example
└── README.md
```

## ライセンス

MIT
