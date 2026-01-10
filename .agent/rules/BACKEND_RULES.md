---
trigger: glob
globs: lib, app/api
---

## 🔙 Backend Architecture Rules

This document defines the backend architecture, focusing on the logic living inside `/lib` and the API route handlers.

### 🏛 Layer Responsibilities

#### **1. Route Handlers (`app/api/**/route.ts`)**
* Only place where `Request` and `NextResponse` are used.
* Must stay extremely small.
* Responsibilities: Parse request, call controller, convert controller output → `NextResponse`.
* **Important**: Always include `'x-request-method': 'METHOD'` in headers for frontend error handling.
* **No business logic.**

#### **2. Controllers (`*.controller.ts`)**
* Coordinate application logic.
* Validate input using Zod.
* Call service functions.
* Return a normalized response: `{ status: number, body: any }`.
* **Important**: Use `catchError(err)` from `@/lib/errors/app-error` to ensure consistent error formats.
* **Controllers DO NOT:** Access MongoDB directly, contain business logic, or import from `app/`.

#### **3. Services (`*.service.ts`)**
* All business logic lives here.
* Domain rules and communication with MongoDB (via `lib/db`).
* Throw `AppError` on rule failures.
* **Services DO NOT:** Validate raw input, know HTTP, or use Zod.

#### **4. Schemas (`*.schema.ts`)**
* Zod schemas define request/response shapes.

#### **5. Models (`model/*.model.ts`)**
* Represent domain entities and transformers.
* DB result → Domain JSON mapper functions.
* **No DB logic inside models.**

---

### 📡 Data Layer (MongoDB)
* No Prisma. Use **MongoDB** via `lib/db/`.
* Services may import DB utilities directly.

---

### 🚧 Error Handling
* Use `AppError` class from `lib/errors/app-error.ts`.
* Services throw `AppError`, Controllers translate them to HTTP.

---

### 🔄 Flow Diagram
```
[HTTP Request] → app/api/**/route.ts → controller → validate (schema) → service → controller result → NextResponse
```

---

### 🧪 Backend Testing
* **Integration Tests**: `__tests__/e2e/`. Import route handlers directly, mock `Request`, assert on `Response`.
* **Unit Tests**: `lib/**/*.test.ts`. Test business logic in services, validation in controllers.

---

### 📜 Backend Code Snippets

#### Controller
```ts
export async function handleLogin(input: unknown) {
  try {
    const parsed = LoginSchema.parse(input);
    const result = await loginUser(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    catchError(err)
  }
}
```

#### Route Handler
```ts
export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleLogin(data);
  return NextResponse.json(body, { status });
}
```

#### Service
```ts
export async function loginUser({ email, password }) {
  const user = await users.findByEmail(email);
  if (!user) throw new AppError(404, "USER_NOT_FOUND");
  // ...
  return { token: users.issueToken(user) };
}
```
