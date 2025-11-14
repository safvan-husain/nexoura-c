# 🚀 Quick Start Guide

## Setup (First Time)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Update .env.local with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/nexoura
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# 4. Seed admin user
npm run seed:admin
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
# Unit tests only
npm run test:unit

# Specific file
npm test -- lib/models/__tests__/user.model.test.ts

# Specific test
npm test -- -t "should create a new user"
```

## API Endpoints

### Authentication
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexoura.com","password":"admin123456"}'
```

### Products
```bash
# Get all products
curl http://localhost:3000/api/products

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","slug":"product","description":"Description","price":29.99,"stock":100,"sku":"SKU-001"}'

# Get product by ID
curl http://localhost:3000/api/products/[ID]

# Update product
curl -X PUT http://localhost:3000/api/products/[ID] \
  -H "Content-Type: application/json" \
  -d '{"price":24.99}'

# Delete product
curl -X DELETE http://localhost:3000/api/products/[ID]
```

## Project Structure

```
nexoura-c/
├── app/api/              # API routes
├── lib/                  # Business logic
│   ├── auth/            # Authentication
│   ├── product/         # Products
│   ├── models/          # Typegoose models
│   ├── db/              # Database connection
│   └── errors/          # Error handling
├── __tests__/           # E2E tests
└── scripts/             # Utility scripts
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:unit        # Unit tests only
npm run test:e2e         # E2E tests only

# Database
npm run seed:admin       # Create admin user

# Code Quality
npm run lint             # Run ESLint
```

## Default Credentials

After running `npm run seed:admin`:

**Admin Account:**
- Email: `admin@nexoura.com`
- Password: `admin123456`

⚠️ **Change password after first login!**

## Environment Variables

Required in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/nexoura
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Test Results

```
✅ 57 unit tests passing
✅ In-memory MongoDB
✅ ~6 second execution
✅ 100% core coverage
```

## Documentation

- **AGENTS.md** - Architecture rules
- **MONGODB_INTEGRATION.md** - MongoDB setup
- **TESTING.md** - Testing guide
- **TESTING_COMPLETE.md** - Test results
- **API_TESTING.md** - API examples

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexoura
```

### Test Failures
```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

## Next Steps

1. ✅ MongoDB integrated
2. ✅ Tests implemented
3. 🔄 Add JWT middleware
4. 🔄 Add file upload
5. 🔄 Add email service
6. 🔄 Deploy to production

## Support

For issues or questions:
1. Check documentation files
2. Review test examples
3. Check API_TESTING.md for curl examples
