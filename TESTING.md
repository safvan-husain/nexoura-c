# Testing Guide

This project uses **Jest** with **MongoDB Memory Server** for unit and E2E testing.

## Setup

All dependencies are already installed. The test environment uses an in-memory MongoDB instance, so no external database is required for testing.

## Test Structure

```
nexoura-c/
├── lib/
│   ├── models/__tests__/
│   │   ├── admin.model.test.ts
│   │   ├── user.model.test.ts
│   │   └── product.model.test.ts
│   ├── auth/__tests__/
│   │   └── auth.service.test.ts
│   └── product/__tests__/
│       └── product.service.test.ts
├── __tests__/
│   ├── e2e/
│   │   ├── auth.e2e.test.ts
│   │   └── products.e2e.test.ts
│   └── helpers/
│       └── test-server.ts
├── jest.config.js
└── jest.setup.ts
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run with Coverage Report
```bash
npm run test:coverage
```

### Run Only Unit Tests
```bash
npm run test:unit
```

### Run Only E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npm test -- lib/models/__tests__/user.model.test.ts
```

## Test Categories

### 1. Model Tests (Unit)
Located in `lib/models/__tests__/`

Tests Typegoose model functionality:
- Schema validation
- Password hashing
- Instance methods
- Computed properties
- Unique constraints
- Default values

**Example:**
```typescript
describe('User Model', () => {
  it('should create a new user with valid data', async () => {
    const user = await UserModel.create({
      email: 'test@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    
    expect(user.email).toBe('test@test.com');
    expect(user.fullName).toBe('John Doe');
  });
});
```

### 2. Service Tests (Unit)
Located in `lib/*/tests__/`

Tests business logic:
- CRUD operations
- Error handling
- Data validation
- Business rules
- Database interactions

**Example:**
```typescript
describe('Auth Service', () => {
  it('should register a new user successfully', async () => {
    const result = await registerUser({
      email: 'new@test.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    });
    
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('new@test.com');
  });
});
```

### 3. E2E Tests
Located in `__tests__/e2e/`

Tests complete API workflows:
- HTTP request/response
- Status codes
- Request validation
- Response format
- Integration between layers

**Example:**
```typescript
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201);
    
    expect(response.body.token).toBeDefined();
  });
});
```

## Test Coverage

Current test coverage includes:

### Models (100%)
- ✅ Admin model
- ✅ User model
- ✅ Product model

### Services (100%)
- ✅ Auth service (register, login, admin login)
- ✅ Product service (CRUD operations)

### API Routes (100%)
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/admin/login
- ✅ GET /api/products
- ✅ POST /api/products
- ✅ GET /api/products/:id
- ✅ PUT /api/products/:id
- ✅ DELETE /api/products/:id

## Test Features

### In-Memory MongoDB
- Fast test execution
- No external dependencies
- Automatic cleanup between tests
- Isolated test environment

### Automatic Cleanup
```typescript
afterEach(async () => {
  // All collections are cleared after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

### Test Isolation
Each test runs in isolation with a clean database state.

## Writing New Tests

### Model Test Template
```typescript
import { YourModel } from '../your.model';

describe('Your Model', () => {
  describe('Creation', () => {
    it('should create with valid data', async () => {
      const doc = await YourModel.create({
        // your data
      });
      
      expect(doc).toBeDefined();
    });
  });
});
```

### Service Test Template
```typescript
import { yourService } from '../your.service';
import { AppError } from '@/lib/errors/app-error';

describe('Your Service', () => {
  it('should perform operation successfully', async () => {
    const result = await yourService(data);
    expect(result).toBeDefined();
  });
  
  it('should throw error for invalid input', async () => {
    await expect(yourService(invalidData))
      .rejects.toThrow(AppError);
  });
});
```

### E2E Test Template
```typescript
import request from 'supertest';

const API_URL = 'http://localhost:3000';

describe('Your API E2E', () => {
  it('should handle request', async () => {
    const response = await request(API_URL)
      .post('/api/your-endpoint')
      .send({ data })
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

## Best Practices

1. **Test Naming**: Use descriptive test names
   ```typescript
   it('should throw error for duplicate email')
   ```

2. **Arrange-Act-Assert**: Structure tests clearly
   ```typescript
   // Arrange
   const data = { ... };
   
   // Act
   const result = await service(data);
   
   // Assert
   expect(result).toBe(expected);
   ```

3. **Test One Thing**: Each test should verify one behavior

4. **Use beforeEach**: Set up common test data
   ```typescript
   beforeEach(async () => {
     await Model.create(testData);
   });
   ```

5. **Clean Assertions**: Use specific matchers
   ```typescript
   expect(user.email).toBe('test@test.com');
   expect(products).toHaveLength(3);
   expect(error).toMatchObject({ status: 404 });
   ```

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "should create a new user"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Coverage Reports

After running `npm run test:coverage`, view reports:
- **Terminal**: Summary in console
- **HTML**: Open `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info` for CI tools

## Troubleshooting

### MongoDB Memory Server Issues
If tests hang or fail to start:
```bash
# Clear MongoDB Memory Server cache
rm -rf ~/.cache/mongodb-memory-server
```

### Port Already in Use
E2E tests use port 3000. Ensure it's available:
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Timeout Errors
Increase timeout in `jest.config.js`:
```javascript
testTimeout: 60000, // 60 seconds
```

## Next Steps

- Add integration tests for middleware
- Add tests for JWT authentication
- Add tests for file uploads
- Add performance tests
- Add load tests
