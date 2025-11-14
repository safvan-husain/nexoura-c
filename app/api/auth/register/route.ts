import { NextResponse } from 'next/server';
import { handleRegister } from '@/lib/auth/auth.controller';

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleRegister(data);
  return NextResponse.json(body, { status });
}
