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
* **Use \`use cache\` directive**: Cache components, functions, or data fetches that don't need runtime request data to include them in the static shell.
* **\`cacheLife\` Profiles**: Use \`cacheLife('seconds'|'minutes'|'hours'|'days'|'weeks'|'months'|'years')\` inside a cached scope to set expiration times instead of \`export const revalidate\`.
* **\`cacheTag\` Invalidation**: Use \`cacheTag('my-tag')\` to group cached items and \`revalidateTag('my-tag')\` or \`updateTag('my-tag')\` for invalidation.
* **Suspense boundaries**: Wrap dynamic content and async components in \`<Suspense>\` for streaming and to prevent blocking the static shell.
* **Server Components first**: Use Server Components by default. Client Components are for interactivity (\`"use client"\`).

---

### 📡 Data Fetching & Caching
* **Async Requests**: \`params\` and \`searchParams\` are now promises. Await them or use \`React.use()\` in Client Components.
* **Request Memoization**: Still active for \`fetch\` (GET/HEAD) within the same request lifecycle.
* **\`use cache\` for DB calls**: Wrap database calls or expensive calculations in functions with \`"use cache"\`.
* **Revalidation**: Prefer \`updateTag\` for background revalidation or \`revalidateTag\` for immediate invalidation.
* **Error Handling**: Use \`handleApiError(response, showToast)\` from \`@/lib/utils/api-error-handler\` for client-side fetches.

---

### 🔄 Server Actions & Forms
* Place all mutations in Server Actions (\`lib/actions/*.ts\`).
* Use the \`action\` prop in forms to call Server Actions directly.
* Use \`useToast()\` to display feedback for both success and error states.

---

### 🎨 Design Aesthetics
Use only white mode for the storefront, and for the admin panel, we have a manual switching between white and dark mode.

### Learnings:
export const dynamic is incompatible with the cacheComponents flag enabled in Next.js 16. With cacheComponents, data fetching defaults to runtime execution (dynamic) unless explicitly cached, so the force-dynamic configuration is redundant and effectively disallowed.