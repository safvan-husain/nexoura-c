import { NextResponse } from 'next/server';
import { handleLogin } from '@/lib/auth/auth.controller';

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleLogin(data);
  return NextResponse.json(body, { status });
}
