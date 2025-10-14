import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest, _ctx: { params: { id: string } }) {
  return NextResponse.json({ success: true }, { status: 200 });
}
