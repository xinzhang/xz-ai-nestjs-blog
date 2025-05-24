export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
  posts?: Post[]
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  isPublished: boolean
  views: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  author: User
  categories: Category[]
  comments: Comment[]
}

export interface Comment {
  id: number
  content: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  author: User
  post?: Post
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PostsResponse {
  posts: Post[]
  total: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  bio?: string
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt?: string
  featuredImage?: string
  isPublished?: boolean
  categoryIds?: number[]
}

export interface CreateCommentRequest {
  content: string
  postId: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  color?: string
}
