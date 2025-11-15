import { LoginSchema, RegisterSchema, AdminLoginSchema } from './auth.schema';
import { loginUser, registerUser, loginAdmin } from './auth.service';
import { AppError, catchError } from '@/lib/errors/app-error';

export async function handleRegister(input: unknown) {
  try {
    const parsed = RegisterSchema.parse(input);
    const result = await registerUser(parsed);
    return { status: 201, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleLogin(input: unknown) {
  try {
    const parsed = LoginSchema.parse(input);
    const result = await loginUser(parsed);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleAdminLogin(input: unknown) {
  try {
    const parsed = AdminLoginSchema.parse(input);
    const result = await loginAdmin(parsed);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}
