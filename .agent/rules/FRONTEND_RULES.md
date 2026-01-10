---
trigger: glob
globs: app
---

## 🎨 Frontend Architecture Rules

This document defines the frontend conventions using Next.js 16 and Cache Components.

### 🧬 Component Structure
* **Shared UI**: `components/ui/`
* **Shared Forms**: `components/forms/`
* **Page-specific Components**: `app/<route>/components/`

---

### 📐 Next.js 16 & Cache Components
* **Dynamic by default**: All pages are dynamic unless explicitly cached.
* **Use `use cache` directive**: Cache components/functions that don't need runtime data.
* **Suspense boundaries**: Wrap dynamic content in `<Suspense>` for streaming.
* **Server Components first**: Use Server Components by default, Client Components only when needed (`"use client"`).

---

### 📡 Data Fetching & Caching
* **Runtime APIs**: When using `searchParams` or `params`, pass them as promises to child components wrapped in Suspense.
* **Revalidation**: Use `revalidateTag` after mutations in Server Actions.
* **Error Handling**: Use `handleApiError(response, showToast)` from `@/lib/utils/api-error-handler` for client-side fetch requests to show consistent error toasts with "Copy Details" capability.

---

### 🔄 Server Actions & Forms
* Place all mutations in Server Actions (`lib/actions/*.ts`).
* Use the `action` prop in forms to call Server Actions directly.
* Use `useToast()` to display feedback for both success and error states.

---

### 🎨 Design Aesthetics
* **Rich Aesthetics**: Vibrant colors, dark modes, glassmorphism, and dynamic animations.
* **Modern Typography**: Use Google Fonts like Inter, Roboto, or Outfit.
* **Smooth Transitions**: Subtle micro-animations for enhanced UX.
* **Responsive**: Mobile-first approach, ensuring premium feel on all devices.
