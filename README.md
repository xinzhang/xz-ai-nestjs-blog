# NestJS + React Blogger App

A full-stack blogging platform built with NestJS backend and React frontend.

## 🚀 Project Structure

```
nestjs-blog-app/
├── server/                    # NestJS Backend API
│   ├── src/                   # Source code
│   ├── database/              # Database schema and migrations
│   ├── test/                  # Test files
│   └── docs/                  # API documentation
├── web/                       # React Frontend
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   └── dist/                  # Built files
├── docker-compose.yml         # Production setup
├── docker-compose.dev.yml     # Development setup
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Backend (NestJS)
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Class Validator** - Input validation

### Frontend (React)
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Data fetching
- **Zustand** - State management
- **React Router** - Navigation
- **React Markdown** - Markdown rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd nestjs-blog-app
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Update database credentials in .env
   
   # Create database
   mysql -u root -p
   CREATE DATABASE blogger_db;
   
   # Start development server
   npm run start:dev
   ```

3. **Frontend Setup:**
   ```bash
   cd web
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/docs

### Docker Development

```bash
# Start everything with Docker
docker-compose -f docker-compose.dev.yml up

# Backend: http://localhost:3000
# Frontend: http://localhost:3001
# Adminer (DB): http://localhost:8080
```

## 🔧 Features

### 🌐 Frontend Features
- **Modern Design** - Clean, responsive UI with Tailwind CSS
- **Dark/Light Mode** - Toggle between themes
- **Blog Homepage** - Featured posts and post grid
- **Post Details** - Full post view with comments
- **User Authentication** - Register, login, logout
- **Admin Dashboard** - Manage posts, categories, users
- **Responsive Design** - Works on all devices
- **SEO Friendly** - Optimized for search engines

### 🔧 Backend Features
- **RESTful API** - Complete CRUD operations
- **Authentication** - JWT-based auth system
- **Authorization** - Role-based access control
- **Data Validation** - Input validation and sanitization
- **Error Handling** - Comprehensive error responses
- **Database Relations** - Proper foreign key relationships
- **Pagination** - Efficient data loading
- **File Upload** - Image upload support
- **Testing** - Unit and integration tests

### 📝 Content Management
- **Posts** - Create, edit, delete blog posts
- **Categories** - Organize posts by category
- **Comments** - User engagement system
- **Users** - User management and profiles
- **Draft System** - Save drafts before publishing
- **Rich Editor** - Markdown support for writing
- **Media Library** - Image management

## 📱 User Roles

### Public Users
- View published posts
- Read post details
- Browse by categories
- Search posts

### Registered Users
- All public features
- Create account
- Login/logout
- Comment on posts
- Manage profile

### Admin Users
- All user features
- Create/edit/delete posts
- Manage categories
- Moderate comments
- User management
- Analytics dashboard

## 🎨 Design System

The frontend uses a cohesive design system with:
- **Typography** - Consistent font hierarchy
- **Colors** - Brand colors with dark/light variants
- **Components** - Reusable UI components
- **Icons** - Lucide React icon set
- **Animations** - Smooth transitions and micro-interactions
- **Responsive Grid** - Mobile-first design approach

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create post (auth required)
- `PUT /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (auth required)
- `PUT /categories/:id` - Update category (auth required)
- `DELETE /categories/:id` - Delete category (auth required)

### Comments
- `GET /comments/post/:postId` - Get post comments
- `POST /comments` - Create comment (auth required)
- `PUT /comments/:id` - Update comment (auth required)
- `DELETE /comments/:id` - Delete comment (auth required)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user (auth required)

## 🔒 Security Features

- **Password Hashing** - Bcrypt encryption
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Prevent malicious input
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Content sanitization
- **CORS Configuration** - Cross-origin request handling
- **Rate Limiting** - Prevent abuse
- **Environment Variables** - Secure configuration

## 🚀 Deployment

### Production Docker

```bash
# Build and start production containers
docker-compose up -d

# The app will be available at http://localhost
```

### Manual Deployment

1. **Backend:**
   ```bash
   cd server
   npm run build
   npm run start:prod
   ```

2. **Frontend:**
   ```bash
   cd web
   npm run build
   # Serve the dist folder with a web server
   ```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test                    # Unit tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # Coverage report
```

### Frontend Tests
```bash
cd web
npm test                    # Component tests
```

## 🔧 Development Tools

- **Hot Reload** - Automatic server restart
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Docker** - Containerization
- **Adminer** - Database management

## 📚 Documentation

- **API Documentation** - Available at `/docs` endpoint
- **Database Schema** - See `server/database/ERD.md`
- **Component Docs** - Storybook documentation
- **Deployment Guide** - Production setup instructions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS** - For the amazing backend framework
- **React** - For the powerful frontend library
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful UI components
- **Radix UI** - For the accessible component primitives

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Read the documentation in `/docs`
3. Join our Discord community
4. Contact us at support@devblog.com

---

**Happy Blogging!** 🎉
