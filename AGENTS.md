## 🧠 Overview

This document defines the **architecture rules and conventions** the coding agent must follow while generating, updating, or refactoring code inside this project.
Goal: **clean separation of concerns**, **feature-based organization**, and **reusable business logic** shared across both web UI and external clients.

This project uses:

* **Next.js App Router**
* **Feature-based backend logic inside `/lib`**
* **Zod** for input/output schemas
* **MongoDB** as the primary database (no Prisma)
* **HTTP endpoints under `app/api/.../route.ts`**

---

## 📁 Folder Structure

```
app/
  api/
    auth/
      route.ts
    product/
      route.ts

components/

lib/
  auth/
    auth.service.ts
    auth.schema.ts
    auth.controller.ts
    model/
      user.model.ts
    index.ts
  product/
    product.service.ts
    product.schema.ts
    product.controller.ts
    model/
      product.model.ts
    index.ts

lib/db/
  mongo-client.ts          // MongoDB connection + helpers
  (Other DB adapters)

lib/errors/
  app-error.ts

lib/middleware/
  (...)

lib/utils/
  (...)
```

---

## 🏛 Layer Responsibilities

### **1. Route Handlers (`app/api/**/route.ts`)**

* Only place where `Request` and `NextResponse` are used.
* Must stay extremely small.

Responsibilities:

* Parse request (`req.json()`)
* Call the correct controller function
* Convert controller output → `NextResponse`

**No business logic.**

---

### **2. Controllers (`*.controller.ts`)**

Controllers coordinate application logic.

Responsibilities:

* Validate input using Zod
* Call service functions
* Return a normalized response:

```ts
{ status: number, body: any }
```

* Convert `AppError` → HTTP-safe output

**Controllers DO NOT:**

* Access MongoDB directly
* Contain business logic
* Import from `app/`

---

### **3. Services (`*.service.ts`)**

All business logic lives here.

Responsibilities:

* Domain rules
* Communicate with MongoDB (via `lib/db`)
* Throw `AppError` on rule failures
* Return domain objects (not HTTP)

**Services DO NOT:**

* Validate raw input
* Know HTTP
* Use Zod

---

### **4. Schemas (`*.schema.ts`)**

Zod schemas define request/response shapes.

Example:

```ts
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;
```

---

### **5. Models (`model/*.model.ts`)**

Models represent domain entities and transformers.

Responsibilities:

* Domain types
* DB result → Domain JSON mapper functions
* Serialization helpers

**No DB logic inside models.**

---

## 📡 Data Layer (MongoDB)

No Prisma.
Your data layer uses **MongoDB** through a custom adapter.

Place all DB logic in:

```
lib/db/
```

Examples:

* `mongo-client.ts`
* `<feature>-db.ts`

Services may import DB utilities directly.

---

## 🚧 Error Handling

Use a single `AppError` class.

```ts
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(code);
  }
}
```

Services throw `AppError`.
Controllers translate them to HTTP responses.

---

## 🔄 Flow Diagram

```
[HTTP Request]
      ↓
app/api/**/route.ts
      ↓
controller.handleAction(input)
      ↓        ↑
validate ←──── schema (Zod)
      ↓
service.function(validData)
      ↓
(model transforms)
      ↓
controller result
      ↓
NextResponse.json(...)
      ↓
[HTTP Response]
```

---

## 📐 Naming Conventions

File names:

```
auth.service.ts
auth.schema.ts
auth.controller.ts
model/user.model.ts
```

Functions:

* Services → verbs: `createUser`, `loginUser`
* Controllers → `handleXxx`: `handleLogin`
* Schemas → PascalCase: `LoginSchema`

---

## 📥 Import & Dependency Rules

1. **`app/*` must never be imported inside `lib/*`.**

2. Route handlers import only from:

   * controllers
   * utils

3. Controllers may import:

   * schemas
   * services
   * models

4. Services may import:

   * MongoDB adapters
   * models
   * utils

5. **No circular imports allowed.**

---

## 🧪 Testing Policy

(As you said—no strict requirements.)

Agent must ensure:

* pure functions where possible
* minimal side effects
* separated concerns

---

## 📜 Code Snippets

### Controller

```ts
// lib/auth/auth.controller.ts
import { LoginSchema } from './auth.schema';
import { loginUser } from './auth.service';
import { AppError } from '@/lib/errors/app-error';

export async function handleLogin(input: unknown) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: "VALIDATION_ERROR", details: parsed.error.errors }
    };
  }

  try {
    const result = await loginUser(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: "INTERNAL_SERVER_ERROR" } };
  }
}
```

---

### Route Handler

```ts
// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { handleLogin } from '@/lib/auth/auth.controller';

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleLogin(data);
  return NextResponse.json(body, { status });
}
```

---

### Service (MongoDB example)

```ts
// lib/auth/auth.service.ts
import { AppError } from '@/lib/errors/app-error';
import { users } from '@/lib/db/users-db';

export async function loginUser({ email, password }) {
  const user = await users.findByEmail(email);
  if (!user) throw new AppError(404, "USER_NOT_FOUND");

  const isValid = await users.verifyPassword(password, user.passwordHash);
  if (!isValid) throw new AppError(401, "INVALID_CREDENTIALS");

  return { token: users.issueToken(user) };
}
```

---

## 🧬 Component Structure

```
components/
  Button.tsx
  Card.tsx

app/
  dashboard/
    page.tsx
    components/
      DashboardCard.tsx
  product/
    page.tsx
    components/
      ProductCard.tsx
```

---

## 🧩 Adding a New Feature (Checklist)

1. Create folder: `lib/<feature>/`

2. Add:

   * `<feature>.schema.ts`
   * `<feature>.service.ts`
   * `<feature>.controller.ts`
   * `model/<entity>.model.ts`
   * `index.ts`

3. Add route:

```
app/api/<feature>/route.ts
```

4. Route → Controller → Service → MongoDB layer
5. Add UI pages if needed
6. Put shared components under `/components`

---

## ✅ Final Notes

* **No business logic in route handlers.**
* **All validation must use Zod.**
* **MongoDB access only through `lib/db/`.**
* **Never import from `app/*` inside `lib/*`.**
* **Follow this structure unless explicitly overridden.**

---