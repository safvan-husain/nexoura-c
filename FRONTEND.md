# Frontend Documentation

## Overview

The frontend is built with **Next.js 16** using the App Router with **Cache Components** enabled for optimal performance.

## Architecture

### Key Features

- **Server Components by default**: All components are Server Components unless marked with `"use client"`
- **Cache Components**: Enabled for fine-grained caching control
- **Server Actions**: Form submissions and mutations use Server Actions
- **Suspense boundaries**: Dynamic content wrapped in Suspense for streaming
- **Optimistic caching**: Data cached with `use cache` and revalidated with tags

### Folder Structure

```
app/
  (auth)/                    # Auth route group
    login/
      page.tsx              # Login page
      LoginForm.tsx         # Client component for form
    register/
      page.tsx              # Register page
      RegisterForm.tsx      # Client component for form
  
  admin/                    # Admin routes
    login/
      page.tsx              # Admin login
      AdminLoginForm.tsx
    dashboard/
      page.tsx              # Admin dashboard
    products/
      page.tsx              # Product management
      DeleteProductButton.tsx
  
  products/                 # Public product pages
    page.tsx                # Product listing
    ProductCard.tsx         # Product card component
    [id]/
      page.tsx              # Product detail page
  
  page.tsx                  # Home page
  layout.tsx                # Root layout

components/
  ui/                       # Reusable UI components
    Button.tsx
    Input.tsx
    Card.tsx

lib/
  actions/                  # Server Actions
    auth.actions.ts         # Auth mutations
    product.actions.ts      # Product mutations
  
  api/                      # Data fetching functions
    products.ts             # Product API calls with caching
    categories.ts           # Category API calls with caching
```

## Caching Strategy

### Data Fetching with `use cache`

```typescript
import { cacheLife, cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')
  
  const res = await fetch('/api/products')
  return res.json()
}
```

### Revalidation with Tags

```typescript
'use server'

import { revalidateTag } from 'next/cache'

export async function createProduct(formData: FormData) {
  // Create product...
  
  // Revalidate cached data
  revalidateTag('products')
}
```

## Pages

### Public Pages

- **`/`** - Home page with links to products and auth
- **`/products`** - Product listing with pagination
- **`/products/[id]`** - Product detail page
- **`/login`** - User login
- **`/register`** - User registration

### Admin Pages

- **`/admin/login`** - Admin login
- **`/admin/dashboard`** - Admin dashboard with stats
- **`/admin/products`** - Product management (list, edit, delete)

## Authentication

### Cookie-based Sessions

- User token stored in `auth_token` cookie
- Admin token stored in `admin_token` cookie
- HttpOnly, Secure (in production), SameSite=Lax
- 7-day expiration

### Server Actions

```typescript
// lib/actions/auth.actions.ts
'use server'

export async function loginAction(formData: FormData) {
  // Authenticate user
  // Set cookie
  // Redirect
}
```

## Forms

### Using Server Actions

```tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  
  return (
    <form action={formAction}>
      {state?.error && <div>{state.error}</div>}
      <input name="email" required />
      <button disabled={isPending}>Login</button>
    </form>
  )
}
```

## Performance Optimizations

### 1. Cache Components

All routes are dynamic by default. Use `use cache` to cache:
- Product listings
- Category data
- Static content

### 2. Suspense Boundaries

Wrap dynamic content in Suspense for streaming:

```tsx
<Suspense fallback={<Loading />}>
  <DynamicContent />
</Suspense>
```

### 3. Parallel Data Fetching

Multiple data fetches happen in parallel automatically with Server Components.

### 4. Optimistic Updates

Use `revalidateTag` after mutations to update cached data instantly.

## Development

### Running the Dev Server

```bash
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `NEXT_PUBLIC_API_URL` - API URL (default: http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Next Steps

### TODO

- [ ] Add category management UI
- [ ] Add product image upload
- [ ] Add user profile page
- [ ] Add order management
- [ ] Add search functionality
- [ ] Add filters for products
- [ ] Add shopping cart
- [ ] Add checkout flow
- [ ] Add payment integration
- [ ] Add email notifications

### Improvements

- Add loading skeletons for better UX
- Add error boundaries
- Add toast notifications
- Add form validation feedback
- Add image optimization
- Add SEO metadata
- Add analytics
