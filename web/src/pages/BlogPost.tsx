import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { postsApi, commentsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Eye,
  MessageCircle,
  Calendar,
  ArrowLeft,
  Share2,
  Heart,
  Bookmark,
  Send,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");

  const { data: postData, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", postData?.data?.id],
    queryFn: () => commentsApi.getByPost(postData!.data.id),
    enabled: !!postData?.data?.id,
  });

  const commentMutation = useMutation({
    mutationFn: commentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postData?.data?.id],
      });
      setCommentContent("");
      console.info("Comment added successfully!");
    },
    onError: (error: any) => {
      console.error(error.response?.data?.message || "Failed to add comment");
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !postData?.data?.id) return;

    commentMutation.mutate({
      content: commentContent.trim(),
      postId: postData.data.id,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.info("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-muted rounded mb-4 w-1/4'></div>
          <div className='h-12 bg-muted rounded mb-4'></div>
          <div className='h-4 bg-muted rounded mb-2 w-1/3'></div>
          <div className='h-64 bg-muted rounded mb-8'></div>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-4 bg-muted rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!postData?.data) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Post not found</h1>
        <p className='text-muted-foreground mb-4'>
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to='/'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const post = postData.data;
  const comments = commentsData?.data || [];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-12'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <Button variant='ghost' asChild className='mb-6'>
              <Link to='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Posts
              </Link>
            </Button>

            <div className='flex flex-wrap gap-2 mb-4'>
              {post.categories.map((category) => (
                <Badge
                  key={category.id}
                  variant='secondary'
                  style={{
                    backgroundColor: category.color + "20",
                    color: category.color,
                  }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className='text-xl text-muted-foreground mb-8'>
                {post.excerpt}
              </p>
            )}

            {/* Author and Meta */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.firstName?.[0] || post.author.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>
                    {post.author.firstName} {post.author.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    @{post.author.username}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(post.createdAt)}
                </div>
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  {post.views} views
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle className='h-4 w-4' />
                  {comments.length} comments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex gap-8'>
            {/* Article Content */}
            <article className='flex-1'>
              {post.featuredImage && (
                <div className='mb-8'>
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className='w-full h-64 md:h-96 object-cover rounded-lg'
                  />
                </div>
              )}

              <div className='prose prose-lg max-w-none'>
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-4 mt-8 pt-8 border-t'>
                <Button variant='outline' size='sm'>
                  <Heart className='mr-2 h-4 w-4' />
                  Like
                </Button>
                <Button variant='outline' size='sm'>
                  <Bookmark className='mr-2 h-4 w-4' />
                  Save
                </Button>
                <Button variant='outline' size='sm' onClick={handleShare}>
                  <Share2 className='mr-2 h-4 w-4' />
                  Share
                </Button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className='hidden lg:block w-80'>
              <div className='sticky top-8 space-y-6'>
                {/* Author Card */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-16 w-16'>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          {post.author.firstName?.[0] ||
                            post.author.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-semibold'>
                          {post.author.firstName} {post.author.lastName}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          @{post.author.username}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {post.author.bio && (
                    <CardContent>
                      <p className='text-sm text-muted-foreground'>
                        {post.author.bio}
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Table of Contents could go here */}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className='bg-muted/30 py-12'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-2xl font-bold mb-8'>
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {isAuthenticated ? (
              <Card className='mb-8'>
                <CardContent className='pt-6'>
                  <form onSubmit={handleCommentSubmit} className='space-y-4'>
                    <div className='flex gap-4'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <Textarea
                          placeholder='Share your thoughts...'
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        disabled={
                          !commentContent.trim() || commentMutation.isPending
                        }
                      >
                        {commentMutation.isPending ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' />
                            Post Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className='mb-8'>
                <CardContent className='pt-6 text-center'>
                  <p className='text-muted-foreground mb-4'>
                    Sign in to join the conversation
                  </p>
                  <div className='flex justify-center gap-4'>
                    <Button asChild>
                      <Link to='/login'>Sign In</Link>
                    </Button>
                    <Button variant='outline' asChild>
                      <Link to='/register'>Create Account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className='space-y-6'>
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className='pt-6'>
                    <div className='flex gap-4'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.firstName?.[0] ||
                            comment.author.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h4 className='font-semibold'>
                            {comment.author.firstName} {comment.author.lastName}
                          </h4>
                          <span className='text-sm text-muted-foreground'>
                            @{comment.author.username}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            • {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className='text-muted-foreground'>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {comments.length === 0 && (
                <div className='text-center py-8'>
                  <MessageCircle className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='font-semibold mb-2'>No comments yet</h3>
                  <p className='text-muted-foreground'>
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
