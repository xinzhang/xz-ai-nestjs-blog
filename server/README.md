# NestJS Blogger API Server

A powerful blogging platform API built with NestJS and Prisma, using PostgreSQL as the database.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+ (running on port 5532 as configured)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   The `.env` file is already configured for your PostgreSQL setup:
   ```env
   DATABASE_URL="postgresql://root:root@localhost:5532/blogger_db?schema=public"
   ```

3. **Database Setup:**
   ```bash
   # Make setup script executable
   chmod +x scripts/setup-db.sh
   
   # Run the setup script
   ./scripts/setup-db.sh
   ```
   
   Or manually:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Create database schema
   npm run db:push
   
   # Seed with initial data
   npm run prisma:seed
   ```

4. **Start the server:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3100`

## 🏗️ Architecture

### Technology Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Powerful relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Class Validator** - Request validation

### Database Schema

The application uses the following main entities:

- **Users** - User accounts and profiles
- **Posts** - Blog posts with content
- **Categories** - Post categorization
- **Comments** - User comments on posts
- **PostCategory** - Many-to-many relationship between posts and categories

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Posts
- `GET /posts` - Get all published posts (with pagination)
- `GET /posts/:id` - Get post by ID
- `GET /posts/slug/:slug` - Get post by slug
- `POST /posts` - Create new post (authenticated)
- `PATCH /posts/:id` - Update post (authenticated, author only)
- `DELETE /posts/:id` - Delete post (authenticated, author only)
- `GET /posts/author/:authorId` - Get posts by author
- `GET /posts/category/:categoryId` - Get posts by category

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (authenticated)
- `PATCH /categories/:id` - Update category (authenticated)
- `DELETE /categories/:id` - Delete category (authenticated)

### Comments
- `GET /comments/post/:postId` - Get comments for a post
- `POST /comments` - Create comment (authenticated)
- `PATCH /comments/:id` - Update comment (authenticated, author only)
- `DELETE /comments/:id` - Delete comment (authenticated, author only)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user (authenticated)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run db:push           # Push schema to database
npm run db:studio         # Open Prisma Studio
npm run prisma:seed       # Seed database

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run e2e tests

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

### Database Management

**View your database:**
```bash
npm run db:studio
```
This opens Prisma Studio at `http://localhost:5555`

**Reset database:**
```bash
npm run prisma:reset
```

**Create a migration:**
```bash
npx prisma migrate dev --name migration_name
```

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Demo Credentials

```
Username: admin
Password: password123
```

## 📋 Example API Usage

### Register a new user:
```bash
curl -X POST http://localhost:3100/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3100/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Create a post:
```bash
curl -X POST http://localhost:3100/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post...",
    "excerpt": "A brief summary",
    "isPublished": true,
    "categoryIds": [1, 2]
  }'
```

### Get all posts:
```bash
curl http://localhost:3100/posts
```

## 🗄️ Database Schema Details

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  bio       String?
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts    Post[]
  comments Comment[]
}
```

### Post Model
```prisma
model Post {
  id           Int       @id @default(autoincrement())
  title        String
  slug         String    @unique
  content      String
  excerpt      String?
  featuredImage String?
  isPublished  Boolean   @default(false)
  views        Int       @default(0)
  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  authorId     Int
  
  author     User           @relation(fields: [authorId], references: [id])
  comments   Comment[]
  categories PostCategory[]
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables
Make sure to set these environment variables in production:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secure-jwt-secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT="3100"
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Structure
- Unit tests: `src/**/*.spec.ts`
- E2E tests: `test/**/*.e2e-spec.ts`

## 🔧 Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check if PostgreSQL is running on port 5532
   - Verify credentials in `.env` file
   - Ensure database `blogger_db` exists

2. **Prisma client not found:**
   ```bash
   npm run prisma:generate
   ```

3. **Database schema out of sync:**
   ```bash
   npm run db:push
   ```

4. **Port already in use:**
   - Change `PORT` in `.env` file
   - Or kill the process using the port

### Logs

The application logs important information during startup and operation. Check the console output for detailed error messages.

## 📚 API Documentation

Once the server is running, you can explore the API endpoints. Consider adding Swagger documentation for better API exploration:

```bash
npm install @nestjs/swagger swagger-ui-express
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.
