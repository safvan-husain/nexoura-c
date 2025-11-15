# Category Feature Documentation

## Overview

The category feature provides a complete CRUD system for managing product categories with hierarchical support and smart deletion logic.

## Key Features

- **Full CRUD Operations**: Create, Read, Update, Delete categories
- **Hierarchical Categories**: Support for parent-child relationships
- **Smart Delete**: Prevents deletion of categories in use by products
- **Category Replacement**: Option to replace deleted category with another in all products
- **Product Integration**: Products now reference categories by ID instead of strings
- **Validation**: Comprehensive input validation using Zod schemas

## API Endpoints

### Admin Category Management

#### Create Category
```
POST /api/admin/categories
```

**Request Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "parent": "optional-parent-category-id",
  "isActive": true,
  "sortOrder": 1,
  "metadata": {}
}
```

**Response:** `201 Created`
```json
{
  "_id": "category-id",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Categories
```
GET /api/admin/categories?page=1&limit=20&search=electronics&isActive=true&sortBy=sortOrder&sortOrder=asc
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (optional)
- `isActive` (optional: true/false)
- `parent` (optional: category ID or "null" for root categories)
- `sortBy` (default: sortOrder, options: name, sortOrder, createdAt)
- `sortOrder` (default: asc, options: asc, desc)

**Response:** `200 OK`
```json
{
  "categories": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Get Category by ID
```
GET /api/admin/categories/:id
```

**Response:** `200 OK`

#### Get Category by Slug
```
GET /api/admin/categories/slug/:slug
```

**Response:** `200 OK`

#### Update Category
```
PUT /api/admin/categories/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": false,
  "sortOrder": 5
}
```

**Response:** `200 OK`

#### Delete Category
```
DELETE /api/admin/categories/:id
```

**Request Body:** (optional)
```json
{
  "replacementCategoryId": "optional-replacement-category-id"
}
```

**Response:** `200 OK`
```json
{
  "message": "Category deleted successfully",
  "productsUpdated": 5
}
```

## Smart Delete Logic

When deleting a category:

1. **No Products Using Category**: Category is deleted immediately
2. **Products Using Category (No Replacement)**: Returns `400 Bad Request` with error details
3. **Products Using Category (With Replacement)**: 
   - Validates replacement category exists
   - Replaces category in all products
   - Deletes the original category
4. **Child Categories**: Sets parent to null for all child categories

## Error Codes

- `CATEGORY_ALREADY_EXISTS` (409): Slug already in use
- `CATEGORY_NOT_FOUND` (404): Category doesn't exist
- `CATEGORY_IN_USE` (400): Category is used by products (no replacement provided)
- `PARENT_CATEGORY_NOT_FOUND` (404): Parent category doesn't exist
- `INVALID_CATEGORY_ID` (400): Invalid MongoDB ObjectId format
- `INVALID_REPLACEMENT_CATEGORY_ID` (400): Invalid replacement category ID
- `REPLACEMENT_CATEGORY_NOT_FOUND` (404): Replacement category doesn't exist
- `REPLACEMENT_CATEGORY_CANNOT_BE_SAME` (400): Replacement cannot be the same as deleted
- `CATEGORY_CANNOT_BE_ITS_OWN_PARENT` (400): Self-referencing parent
- `VALIDATION_ERROR` (400): Input validation failed

## Product Integration

Products now use category references instead of string arrays:

**Before:**
```typescript
categories: string[]  // ["electronics", "phones"]
```

**After:**
```typescript
categories: Ref<Category>[]  // [ObjectId("..."), ObjectId("...")]
```

### Product Schema Changes

- Categories must be valid MongoDB ObjectIds (24-character hex strings)
- Categories are validated to exist in the database
- Products populate category details (name, slug) when retrieved

### Product Service Updates

All product operations now:
- Validate category IDs exist before creating/updating products
- Populate category details in responses
- Return proper error messages for invalid categories

## File Structure

```
lib/
  models/
    category.model.ts          # Category Typegoose model
  category/
    category.schema.ts         # Zod validation schemas
    category.service.ts        # Business logic
    category.controller.ts     # Request handling
    index.ts                   # Exports

app/
  api/
    admin/
      categories/
        route.ts               # POST, GET endpoints
        [id]/
          route.ts             # GET, PUT, DELETE by ID
        slug/
          [slug]/
            route.ts           # GET by slug

__tests__/
  e2e/
    category.e2e.test.ts       # Integration tests
```

## Testing

Run category tests:
```bash
npm test -- category.e2e.test.ts
```

All 19 integration tests cover:
- Category creation with validation
- Duplicate slug prevention
- Parent-child relationships
- Listing with pagination and filters
- Updates with conflict detection
- Smart deletion with product replacement
- Error handling for all edge cases

## Migration Notes

If you have existing products with string-based categories:

1. Create categories for all unique category strings
2. Update products to reference category IDs
3. Run a migration script to convert string arrays to ObjectId arrays

Example migration:
```typescript
const categories = await CategoryModel.find();
const categoryMap = new Map(categories.map(c => [c.slug, c._id]));

const products = await ProductModel.find();
for (const product of products) {
  product.categories = product.categories.map(slug => categoryMap.get(slug));
  await product.save();
}
```
