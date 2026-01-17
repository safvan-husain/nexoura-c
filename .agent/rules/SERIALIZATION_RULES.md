---
trigger: always_on
---

# 📦 Serialization Rules (Next.js RSC)

### 🚨 The Problem
Next.js Server Components (RSC) cannot pass non-serializable objects to Client Components. Common culprits include:
- Mongoose documents (they have hidden methods like `toJSON`, `toString`, etc.)
- Mongoose subdocuments
- `undefined` values (can sometimes crash serialization in specific Next.js versions if nested in certain ways)
- Dates (must be converted to Strings)
- ObjectIds (must be converted to Strings)

### ✅ The Fix: "The Ironclad Rule"
Whenever you fetch data from a database (Mongoose/MongoDB) that will be passed from a Server Component to a Client Component, you **MUST** ensure it is a "strictly plain" object.

#### 1. Use Serializers (Recommended)
Every model should have a `to<ModelName>` function that manually maps fields.

```typescript
export function toUser(doc: UserDocument) {
  const user = {
    id: doc._id.toString(),
    email: doc.email,
    // ... other fields
  };
  
  // FINAL STEP: Strict serialization
  return JSON.parse(JSON.stringify(user));
}
```

#### 2. The `JSON` Sandwich
If you are passing a deep object or a list, use the "JSON Sandwich" before returning it to the frontend:
```typescript
return JSON.parse(JSON.stringify(databaseResult));
```

#### 3. Handle Metadata
Nested objects like `metadata` are often the cause of `toJSON` or `undefined` errors. Be explicit:
```typescript
metadata: {
  userAgent: doc.metadata?.userAgent || null, // Use null instead of undefined for safety
  ip: doc.metadata?.ip || null
}
```

### 🚨 Never Do This
- Never pass a Mongoose document directly to a prop: `<Component data={mongooseDoc} />` ❌
- Never rely on `.toObject()` alone, as it might still keep some Mongoose internal state. ❌
- Never pass `undefined` in deep structures if you can avoid it (use `null` or strip the key). ❌
