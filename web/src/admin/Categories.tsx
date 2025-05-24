import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Tags,
  FileText,
  Palette,
  Search,
} from "lucide-react";
import { Category } from "@/types";

const colorOptions = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#374151",
  "#111827",
];

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: colorOptions[0],
  });

  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setIsCreateDialogOpen(false);
      resetForm();
      console.info("Category created successfully");
    },
    onError: () => {
      console.info("Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CategoryFormData>;
    }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setEditingCategory(null);
      resetForm();
      console.info("Category updated successfully");
    },
    onError: () => {
      console.info("Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      console.info("Category deleted successfully");
    },
    onError: () => {
      console.info("Failed to delete category");
    },
  });

  const categories = categoriesData?.data || [];

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: colorOptions[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      console.info("Category name is required");
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || colorOptions[0],
    });
  };

  const handleDelete = (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Categories</h1>
            <p className='text-muted-foreground'>Manage your blog categories</p>
          </div>
        </div>
        <div className='grid gap-4'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-20 bg-muted rounded-lg animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Categories</h1>
          <p className='text-muted-foreground'>
            Manage your blog categories ({filteredCategories.length} total)
          </p>
        </div>
        <Dialog
          open={isCreateDialogOpen || !!editingCategory}
          onOpenChange={handleCloseDialog}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? "Update the category details below."
                    : "Add a new category to organize your blog posts."}
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name *</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder='Category name'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder='Optional description'
                    rows={3}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Color</Label>
                  <div className='flex flex-wrap gap-2'>
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type='button'
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color
                            ? "border-foreground"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className='pt-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search categories...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className='w-4 h-4 rounded-full'
                    style={{ backgroundColor: category.color || "#666" }}
                  />
                  <CardTitle className='text-lg'>{category.name}</CardTitle>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <CardDescription className='mb-4'>
                  {category.description}
                </CardDescription>
              )}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <FileText className='h-4 w-4' />
                  <span>{category.posts?.length || 0} posts</span>
                </div>
                <Badge
                  variant='outline'
                  style={{
                    borderColor: category.color,
                    color: category.color,
                  }}
                >
                  {category.slug}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCategories.length === 0 && (
          <div className='col-span-full'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center py-8'>
                  <Tags className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    No categories found
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first category to organize your blog posts"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Create Category
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
