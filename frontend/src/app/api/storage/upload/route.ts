import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const _form = await req.formData();
    const url = `https://picsum.photos/seed/${Math.random().toString(36).slice(2,8)}/800/600`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
