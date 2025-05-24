import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postsApi, categoriesApi } from '@/lib/api'
import { Post, Category } from '@/types'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Eye, MessageCircle, Calendar, ChevronRight, Sparkles } from 'lucide-react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: () => postsApi.getAll({ page: 1, limit: 12 }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  })

  const posts = postsData?.data?.posts || []
  const categories = categoriesData?.data || []

  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  console.log('home page')

  if (postsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome to DevBlog
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
              Discover Amazing
              <br />
              Developer Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore the latest insights, tutorials, and stories from the developer community.
              Learn, grow, and connect with fellow developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">Start Writing</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#featured">Explore Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Posts
            </Button>
            {categories.map((category: Category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section id="featured" className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Featured Post</h2>
              <p className="text-muted-foreground">Don't miss our latest highlight</p>
            </div>
            
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {featuredPost.featuredImage ? (
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="md:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="text-6xl font-bold text-primary/30 mb-2">
                        {featuredPost.title.charAt(0)}
                      </h3>
                      <p className="text-muted-foreground">Featured Post</p>
                    </div>
                  </div>
                )}
                
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={featuredPost.author.avatar} />
                      <AvatarFallback>
                        {featuredPost.author.firstName?.[0] || featuredPost.author.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">
                        {featuredPost.author.firstName} {featuredPost.author.lastName}
                      </p>
                      <p className="text-muted-foreground">
                        {formatRelativeTime(featuredPost.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredPost.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {featuredPost.comments.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(featuredPost.createdAt)}
                      </div>
                    </div>
                    
                    <Button asChild>
                      <Link to={`/post/${featuredPost.slug}`}>
                        Read More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Discover our most recent articles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post: Post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <h3 className="text-4xl font-bold text-primary/30 mb-2">
                          {post.title.charAt(0)}
                        </h3>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    {post.categories.slice(0, 1).map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-white/90 text-foreground"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {post.author.firstName?.[0] || post.author.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-muted-foreground">
                      {post.author.firstName} {post.author.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • {formatRelativeTime(post.createdAt)}
                    </div>
                  </div>
                  
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments.length}
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/post/${post.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your story!
              </p>
              <Button asChild>
                <Link to="/register">Start Writing</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
