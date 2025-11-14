import { LoginSchema, RegisterSchema, AdminLoginSchema } from './auth.schema';
import { loginUser, registerUser, loginAdmin } from './auth.service';
import { AppError } from '@/lib/errors/app-error';

export async function handleRegister(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await registerUser(parsed.data);
    return { status: 201, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleLogin(input: unknown) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await loginUser(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleAdminLogin(input: unknown) {
  const parsed = AdminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await loginAdmin(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}
