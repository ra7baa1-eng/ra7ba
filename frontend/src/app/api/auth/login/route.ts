import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/db';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const role = email && typeof email === 'string' && email.toLowerCase().includes('admin') ? 'SUPER_ADMIN' : 'MERCHANT';
  const user = users.find(u => u.role === role) || users[0];
  return NextResponse.json({ accessToken: 'mock_access', refreshToken: 'mock_refresh', user }, { status: 200 });
}
