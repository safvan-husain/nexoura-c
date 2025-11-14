import { NextResponse } from 'next/server';
import { handleAdminLogin } from '@/lib/auth/auth.controller';

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleAdminLogin(data);
  return NextResponse.json(body, { status });
}
