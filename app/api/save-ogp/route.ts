import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function generateId(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function POST(request: NextRequest) {
  let body: {
    title?: string;
    description?: string;
    image_url?: string;
    original_url?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの解析に失敗しました" }, { status: 400 });
  }

  if (!body.image_url && !body.title) {
    return NextResponse.json(
      { error: "タイトルまたは画像URLを設定してください" },
      { status: 400 }
    );
  }

  // ID衝突を避けるため最大3回リトライ
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = generateId(6);

    const { error } = await getSupabase().from("ogp_pages").insert({
      id,
      title: body.title ?? "",
      description: body.description ?? "",
      image_url: body.image_url ?? "",
      original_url: body.original_url ?? "",
    });

    if (!error) {
      return NextResponse.json({ id, url: `https://url-gazou.vercel.app/s/${id}` });
    }

    // primary key重複以外のエラーは即座に返す
    if (!error.message.includes("duplicate") && !error.message.includes("unique")) {
      return NextResponse.json({ error: `保存に失敗しました: ${error.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "ID生成に失敗しました。再試行してください。" }, { status: 500 });
}
