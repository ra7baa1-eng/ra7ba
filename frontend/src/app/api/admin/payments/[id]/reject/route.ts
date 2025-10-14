import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, _ctx: { params: { id: string } }) {
  const _ = await req.json();
  return NextResponse.json({ success: true }, { status: 200 });
}
