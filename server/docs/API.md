# API Documentation

## NestJS Blogger API

This document provides detailed information about the Blogger API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Tech enthusiast"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Posts

#### Get All Posts
```http
GET /posts?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with NestJS",
      "slug": "getting-started-with-nestjs",
      "excerpt": "Learn the basics of NestJS framework...",
      "featuredImage": null,
      "isPublished": true,
      "views": 125,
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "author": {
        "id": 2,
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "categories": [
        {
          "id": 1,
          "name": "Technology",
          "slug": "technology",
          "color": "#007BFF"
        }
      ],
      "comments": []
    }
  ],
  "total": 1
}
```

#### Create Post
```http
POST /posts
```
**Requires Authentication**

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "content": "This is the full content of my blog post...",
  "excerpt": "A brief summary of the post",
  "featuredImage": "https://example.com/image.jpg",
  "isPublished": true,
  "categoryIds": [1, 2]
}
```

### Comments

#### Create Comment
```http
POST /comments
```
**Requires Authentication**

**Request Body:**
```json
{
  "content": "Great article! Very helpful.",
  "postId": 1
}
```

#### Get Comments for Post
```http
GET /comments/post/:postId
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Create Category
```http
POST /categories
```
**Requires Authentication**

**Request Body:**
```json
{
  "name": "Technology",
  "description": "Posts about technology and programming",
  "color": "#007BFF"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["username should not be empty"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own posts",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Username or email already exists",
  "error": "Conflict"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

- General API endpoints: 10 requests per second
- Authentication endpoints: 5 requests per second
- Burst allowance: 20 requests for general, 10 for auth

## Pagination

Most list endpoints support pagination:

```
GET /posts?page=2&limit=5
```

Response includes pagination metadata:
```json
{
  "posts": [...],
  "total": 50,
  "page": 2,
  "limit": 5,
  "totalPages": 10
}
```
