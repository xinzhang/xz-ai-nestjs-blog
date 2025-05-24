import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { CreatePostRequest } from "@/types";

export default function CreatePost() {
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

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      console.info("Post created successfully");
      navigate("/admin/posts");
    },
    onError: () => {
      console.info("Failed to create post");
    },
  });

  const categories = categoriesData?.data || [];

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

    createPostMutation.mutate(formData);
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
            <h1 className='text-3xl font-bold'>Create New Post</h1>
            <p className='text-muted-foreground'>
              Write and publish a new blog post
            </p>
          </div>
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
                  Enter the main content of your blog post
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
                  Add a featured image to your post
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
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Publish Actions */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Globe className='h-5 w-5' />
                  Publish
                </CardTitle>
                <CardDescription>
                  Save as draft or publish your post
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleSaveDraft}
                    disabled={createPostMutation.isPending}
                    className='w-full'
                  >
                    <FileX className='mr-2 h-4 w-4' />
                    Save as Draft
                  </Button>
                  <Button
                    type='button'
                    onClick={handlePublish}
                    disabled={createPostMutation.isPending}
                    className='w-full'
                  >
                    <Globe className='mr-2 h-4 w-4' />
                    Publish Now
                  </Button>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Drafts can be edited and published later
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Tags className='h-5 w-5' />
                  Categories
                </CardTitle>
                <CardDescription>
                  Organize your post with categories
                </CardDescription>
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
