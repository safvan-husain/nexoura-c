# API Testing Guide

## Setup

1. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

2. Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nexoura
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

3. Seed admin user:
   ```bash
   npm run seed:admin
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Test Endpoints

### 1. Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nexoura.com",
    "password": "admin123456"
  }'
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 4. Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "slug": "sample-product",
    "description": "This is a sample product description",
    "price": 29.99,
    "stock": 100,
    "sku": "SAMPLE-001",
    "categories": ["electronics"],
    "tags": ["new", "featured"],
    "isActive": true,
    "isFeatured": true
  }'
```

### 5. Get All Products
```bash
curl http://localhost:3000/api/products
```

### 6. Get Products with Filters
```bash
curl "http://localhost:3000/api/products?page=1&limit=10&search=sample&category=electronics&minPrice=10&maxPrice=50&isActive=true&sortBy=price&sortOrder=asc"
```

### 7. Get Product by ID
```bash
curl http://localhost:3000/api/products/[PRODUCT_ID]
```

### 8. Update Product
```bash
curl -X PUT http://localhost:3000/api/products/[PRODUCT_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "price": 24.99,
    "stock": 150
  }'
```

### 9. Delete Product
```bash
curl -X DELETE http://localhost:3000/api/products/[PRODUCT_ID]
```

## Response Examples

### Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe"
  }
}
```

### Error Response
```json
{
  "error": "VALIDATION_ERROR",
  "details": [
    {
      "code": "too_small",
      "minimum": 6,
      "type": "string",
      "path": ["password"],
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

## Notes

- Replace `[PRODUCT_ID]` with actual MongoDB ObjectId
- For authenticated endpoints, add JWT token in Authorization header (to be implemented)
- All timestamps are in ISO 8601 format
