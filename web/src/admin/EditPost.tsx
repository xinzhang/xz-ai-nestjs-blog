import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, categoriesApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Eye,
  ArrowLeft,
  Image,
  Tags,
  FileText,
  Globe,
  FileX,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { CreatePostRequest } from "@/types";
import { formatDate } from "@/lib/utils";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    isPublished: false,
    categoryIds: [],
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => (id ? postsApi.getById(parseInt(id)) : null),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const updatePostMutation = useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: Partial<CreatePostRequest>;
    }) => postsApi.update(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      console.info("Post updated successfully");
      navigate("/admin/posts");
    },
    onError: () => {
      console.info("Failed to update post");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      console.info("Post deleted successfully");
      navigate("/admin/posts");
    },
    onError: () => {
      console.info("Failed to delete post");
    },
  });

  const post = postData?.data;
  const categories = categoriesData?.data || [];

  // Initialize form data when post loads
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        featuredImage: post.featuredImage || "",
        isPublished: post.isPublished,
        categoryIds: post.categories.map((c) => c.id),
      });
      setSelectedCategories(post.categories.map((c) => c.id));
    }
  }, [post]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, categoryIds: selectedCategories }));
  }, [selectedCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      console.info("Post title is required");
      return;
    }

    if (!formData.content.trim()) {
      console.info("Post content is required");
      return;
    }

    if (id) {
      updatePostMutation.mutate({
        postId: parseInt(id),
        data: formData,
      });
    }
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, isPublished: false }));
    setTimeout(() => {
      const form = document.getElementById("post-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 0);
  };

  const handlePublish = () => {
    setFormData((prev) => ({ ...prev, isPublished: true }));
    setTimeout(() => {
      const form = document.getElementById("post-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 0);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      if (id) {
        deletePostMutation.mutate(parseInt(id));
      }
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const words = formData.content.replace(/<[^>]*>/g, "").split(" ");
      const excerpt = words.slice(0, 30).join(" ");
      setFormData((prev) => ({ ...prev, excerpt }));
    }
  };

  if (isPostLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate("/admin/posts")}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Posts
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>Edit Post</h1>
            <p className='text-muted-foreground'>Loading post...</p>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='h-64 bg-muted rounded-lg animate-pulse' />
            ))}
          </div>
          <div className='space-y-6'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-32 bg-muted rounded-lg animate-pulse' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate("/admin/posts")}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Posts
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>Post Not Found</h1>
            <p className='text-muted-foreground'>
              The requested post could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate("/admin/posts")}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Posts
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>Edit Post</h1>
            <p className='text-muted-foreground'>
              Last updated {formatDate(post.updatedAt)}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          {post.isPublished && (
            <Button variant='outline' size='sm' asChild>
              <a
                href={`/post/${post.slug}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Live
              </a>
            </Button>
          )}
          <Button
            variant='destructive'
            size='sm'
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      <form id='post-form' onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Post Content
                </CardTitle>
                <CardDescription>
                  Edit the content of your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title *</Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder='Enter post title...'
                    required
                    className='text-lg'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='excerpt'>Excerpt</Label>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={generateExcerpt}
                      disabled={!formData.content}
                    >
                      Auto-generate
                    </Button>
                  </div>
                  <Textarea
                    id='excerpt'
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    placeholder='Brief description of your post...'
                    rows={3}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Used for post previews and SEO meta descriptions
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='content'>Content *</Label>
                  <Textarea
                    id='content'
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder='Write your post content here...'
                    rows={15}
                    required
                    className='font-mono'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Supports Markdown formatting
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Image className='h-5 w-5' />
                  Featured Image
                </CardTitle>
                <CardDescription>
                  Update the featured image for your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Label htmlFor='featuredImage'>Image URL</Label>
                  <Input
                    id='featuredImage'
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featuredImage: e.target.value,
                      }))
                    }
                    placeholder='https://example.com/image.jpg'
                    type='url'
                  />
                  {formData.featuredImage && (
                    <div className='mt-4'>
                      <img
                        src={formData.featuredImage}
                        alt='Featured'
                        className='w-full h-48 object-cover rounded-lg border'
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Post Statistics
                </CardTitle>
                <CardDescription>
                  Performance metrics for this post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-2xl font-bold'>{post.views}</div>
                    <div className='text-xs text-muted-foreground'>Views</div>
                  </div>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-2xl font-bold'>
                      {post.comments.length}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Comments
                    </div>
                  </div>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-2xl font-bold'>
                      {post.categories.length}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Categories
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Publish Actions */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Globe className='h-5 w-5' />
                  Publish Status
                </CardTitle>
                <CardDescription>
                  Update the publish status of your post
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {post.publishedAt && (
                    <span className='text-sm text-muted-foreground'>
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleSaveDraft}
                    disabled={updatePostMutation.isPending}
                    className='w-full'
                  >
                    <FileX className='mr-2 h-4 w-4' />
                    Save as Draft
                  </Button>
                  <Button
                    type='button'
                    onClick={handlePublish}
                    disabled={updatePostMutation.isPending}
                    className='w-full'
                  >
                    <Globe className='mr-2 h-4 w-4' />
                    {post.isPublished
                      ? "Update & Keep Published"
                      : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Tags className='h-5 w-5' />
                  Categories
                </CardTitle>
                <CardDescription>Update post categories</CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length > 0 ? (
                  <div className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      {categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={
                            selectedCategories.includes(category.id)
                              ? "default"
                              : "outline"
                          }
                          className='cursor-pointer'
                          style={{
                            borderColor: category.color,
                            color: selectedCategories.includes(category.id)
                              ? "white"
                              : category.color,
                            backgroundColor: selectedCategories.includes(
                              category.id
                            )
                              ? category.color
                              : "transparent",
                          }}
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Click categories to select/deselect them
                    </p>
                  </div>
                ) : (
                  <div className='text-center py-4'>
                    <p className='text-sm text-muted-foreground'>
                      No categories available. Create categories first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Post Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Preview
                </CardTitle>
                <CardDescription>
                  Preview how your post will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {formData.featuredImage && (
                    <img
                      src={formData.featuredImage}
                      alt='Featured'
                      className='w-full h-32 object-cover rounded'
                    />
                  )}
                  <div>
                    <h3 className='font-semibold line-clamp-2'>
                      {formData.title || "Post Title"}
                    </h3>
                    {formData.excerpt && (
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-3'>
                        {formData.excerpt}
                      </p>
                    )}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(
                          (c) => c.id === categoryId
                        );
                        return category ? (
                          <Badge
                            key={category.id}
                            variant='outline'
                            className='text-xs'
                            style={{
                              borderColor: category.color,
                              color: category.color,
                            }}
                          >
                            {category.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
