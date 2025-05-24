import { useQuery } from '@tanstack/react-query'
import { postsApi, usersApi, categoriesApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Users, 
  Tags, 
  Eye, 
  TrendingUp, 
  MessageCircle,
  Calendar,
  Activity
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: postsData } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => postsApi.getAll({ page: 1, limit: 100 }),
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: usersApi.getAll,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesApi.getAll,
  })

  const posts = postsData?.data?.posts || []
  const users = usersData?.data || []
  const categories = categoriesData?.data || []

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0)
  const publishedPosts = posts.filter(post => post.isPublished).length
  const draftPosts = posts.filter(post => !post.isPublished).length

  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const topPosts = posts
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published, {draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Total comments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>
              Your latest blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.views} views
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.isPublished ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No posts yet. Create your first post!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Posts
            </CardTitle>
            <CardDescription>
              Most viewed posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.views} views • {post.comments.length} comments
                    </p>
                  </div>
                </div>
              ))}
              {topPosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No posts yet. Create your first post!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Categories
          </CardTitle>
          <CardDescription>
            Content organized by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || '#666' }}
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.posts?.length || 0} posts
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No categories yet. Create your first category!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Create Post</h3>
              <p className="text-xs text-muted-foreground text-center">
                Write a new blog post
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <Tags className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Manage Categories</h3>
              <p className="text-xs text-muted-foreground text-center">
                Organize your content
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">User Management</h3>
              <p className="text-xs text-muted-foreground text-center">
                Manage user accounts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
