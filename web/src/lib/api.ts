import axios from 'axios'

const API_BASE_URL = 'http://localhost:3100'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
    bio?: string
  }) => api.post('/auth/register', userData),
}

// Posts API
export const postsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/posts', { params }),
  
  getById: (id: number) => api.get(`/posts/${id}`),
  
  getBySlug: (slug: string) => api.get(`/posts/slug/${slug}`),
  
  create: (postData: {
    title: string
    content: string
    excerpt?: string
    featuredImage?: string
    isPublished?: boolean
    categoryIds?: number[]
  }) => api.post('/posts', postData),
  
  update: (id: number, postData: Partial<{
    title: string
    content: string
    excerpt?: string
    featuredImage?: string
    isPublished?: boolean
    categoryIds?: number[]
  }>) => api.patch(`/posts/${id}`, postData),
  
  delete: (id: number) => api.delete(`/posts/${id}`),
  
  getByAuthor: (authorId: number) => api.get(`/posts/author/${authorId}`),
  
  getByCategory: (categoryId: number) => api.get(`/posts/category/${categoryId}`),
}

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  
  getById: (id: number) => api.get(`/categories/${id}`),
  
  create: (categoryData: {
    name: string
    description?: string
    color?: string
  }) => api.post('/categories', categoryData),
  
  update: (id: number, categoryData: Partial<{
    name: string
    description?: string
    color?: string
  }>) => api.patch(`/categories/${id}`, categoryData),
  
  delete: (id: number) => api.delete(`/categories/${id}`),
}

// Comments API
export const commentsApi = {
  getByPost: (postId: number) => api.get(`/comments/post/${postId}`),
  
  create: (commentData: {
    content: string
    postId: number
  }) => api.post('/comments', commentData),
  
  update: (id: number, content: string) =>
    api.patch(`/comments/${id}`, { content }),
  
  delete: (id: number) => api.delete(`/comments/${id}`),
}

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  
  getById: (id: number) => api.get(`/users/${id}`),
  
  update: (id: number, userData: Partial<{
    firstName?: string
    lastName?: string
    bio?: string
    avatar?: string
  }>) => api.patch(`/users/${id}`, userData),
}
