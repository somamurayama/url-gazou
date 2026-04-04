import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      { error: "Cloudinaryの環境変数が設定されていません" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "リクエストの解析に失敗しました" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "ファイルが指定されていません" }, { status: 400 });
  }

  // ファイルサイズ上限: 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "ファイルサイズは10MB以下にしてください" },
      { status: 413 }
    );
  }

  // MIMEタイプ確認
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "対応画像形式: JPEG, PNG, GIF, WebP" },
      { status: 415 }
    );
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("upload_preset", uploadPreset);

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadForm,
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!cloudinaryRes.ok) {
      const errorData = await cloudinaryRes.json().catch(() => ({}));
      const message =
        (errorData as { error?: { message?: string } })?.error?.message ||
        `Cloudinaryエラー (HTTP ${cloudinaryRes.status})`;
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = await cloudinaryRes.json();
    return NextResponse.json({ url: data.secure_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json(
      { error: `画像アップロード中にエラーが発生しました: ${message}` },
      { status: 500 }
    );
  }
}
