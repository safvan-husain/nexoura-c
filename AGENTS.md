## 🧠 Agent Context Hub

This document is the entry point for the coding agent. It defines high-level project rules and directs the agent to specialized context files based on the task being performed.

### � Goal
**Reduce context noise** by loading only relevant architecture rules for the current task.

---

### 📂 Specialized Rules

Depending on what you are working on, please load the corresponding context:

1.  **Backend & API Development** 🔙
    *   File: `/.agent/BACKEND_RULES.md`
    *   *Load when: working on routes, controllers, services, MongoDB, or backend logic.*

2.  **Frontend & UI Development** 🎨
    *   File: `/.agent/FRONTEND_RULES.md`
    *   *Load when: working on Next.js pages, components, CSS, animations, or client-side logic.*

---

### 🛠 Common Standards (Always Follow)

*   **Zod** for all input/output validation.
*   **Feature-based organization** in `lib/` and `app/`.
*   **Next.js App Router** (Next.js 16) conventions.
*   **No circular imports.**
*   **Strict Naming**: 
    * Files: `*.service.ts`, `*.controller.ts`, `*.schema.ts`, `model/*.model.ts`.
    * Functions: Services → verbs (`createUser`), Controllers → `handleXxx` (`handleLogin`), Schemas → PascalCase.

---

### 📥 Import & Dependency Rules
1. **`app/*` must never be imported inside `lib/*`.**
2. Route handlers import only from: controllers, utils.
3. Controllers may import: schemas, services, models.
4. Services may import: MongoDB adapters, models, utils.


### 📁 Root Structure Overview
```
app/          # Routes & Page Components
components/   # Shared UI & Forms
lib/          # Core Business Logic (Features)
  <feature>/  # Feature-specific logic
lib/db/       # Data Access Layer
lib/actions/  # Server Actions (Frontend Mutations)
```

---

### ✅ Checklist for New Features
1. Determine if it's primarily Frontend, Backend, or both.
2. Load the relevant rule file(s) from `/.agent/`.
3. Follow the layer responsibilities defined therein.