# Backend Library Structure

This directory contains the backend business logic following a clean architecture pattern.

## Structure

```
lib/
├── auth/                 # Authentication feature
│   ├── auth.schema.ts   # Zod validation schemas
│   ├── auth.service.ts  # Business logic
│   ├── auth.controller.ts # Request handling
│   └── index.ts
├── product/             # Product feature
│   ├── product.schema.ts
│   ├── product.service.ts
│   ├── product.controller.ts
│   └── index.ts
├── models/              # Typegoose models
│   ├── admin.model.ts
│   ├── user.model.ts
│   └── product.model.ts
├── db/                  # Database utilities
│   └── mongo-client.ts
└── errors/              # Error handling
    └── app-error.ts
```

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update M
ongoDB connection string in `.env.local`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Seed initial admin user:
   ```bash
   npm run seed:admin
   ```
   Default credentials:
   - Email: admin@nexoura.com
   - Password: admin123456

## Models

### Admin
- Email/password authentication
- Roles: super_admin, admin
- Password hashing with bcrypt

### User
- Email/password authentication
- Profile information (firstName, lastName, phone)
- Multiple addresses support
- Email verification tokens
- Password reset tokens

### Product
- Complete product information
- Multiple images support
- Product variants
- Categories and tags
- Stock management
- Pricing with compare-at-price
- Rating and reviews count
- Metadata for extensibility

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/products` - List products (with filtering, pagination)
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

## Architecture Rules

1. **Route Handlers** (`app/api/**/route.ts`)
   - Only handle HTTP request/response
   - Call controllers
   - No business logic

2. **Controllers** (`*.controller.ts`)
   - Validate input with Zod
   - Call services
   - Handle errors
   - Return normalized responses

3. **Services** (`*.service.ts`)
   - Contain all business logic
   - Interact with database
   - Throw AppError on failures
   - No HTTP knowledge

4. **Models** (`models/*.model.ts`)
   - Define Typegoose schemas
   - Domain entity types
   - Instance methods

5. **Schemas** (`*.schema.ts`)
   - Zod validation schemas
   - Type inference

## Error Handling

All errors use the `AppError` class:

```typescript
throw new AppError(404, 'PRODUCT_NOT_FOUND');
throw new AppError(409, 'USER_ALREADY_EXISTS', { email });
```

Controllers catch and convert to HTTP responses.

## Environment Variables

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
