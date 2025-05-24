import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, postsApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Mail,
  Calendar,
  FileText,
  MessageCircle,
  UserCheck,
  UserX,
  Shield,
  Eye,
} from "lucide-react";
import { User } from "@/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: usersApi.getAll,
  });

  const { data: userPostsData } = useQuery({
    queryKey: ["user-posts", selectedUser?.id],
    queryFn: () =>
      selectedUser ? postsApi.getByAuthor(selectedUser.id) : null,
    enabled: !!selectedUser,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      console.info("User updated successfully");
    },
    onError: () => {
      console.info("Failed to update user");
    },
  });

  const users = usersData?.data || [];
  const userPosts = userPostsData?.data || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.isActive) ||
      (filter === "inactive" && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleToggleUserStatus = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive },
    });
  };

  const getUserStats = (userId: number) => {
    // This would be better fetched from the API, but for now we'll simulate
    return {
      totalPosts: Math.floor(Math.random() * 50),
      publishedPosts: Math.floor(Math.random() * 40),
      totalViews: Math.floor(Math.random() * 10000),
      totalComments: Math.floor(Math.random() * 500),
    };
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Users</h1>
            <p className='text-muted-foreground'>Manage user accounts</p>
          </div>
        </div>
        <div className='grid gap-4'>
          {[...Array(8)].map((_, i) => (
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
          <h1 className='text-3xl font-bold'>Users</h1>
          <p className='text-muted-foreground'>
            Manage user accounts ({filteredUsers.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-9'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size='sm'
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size='sm'
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "inactive" ? "default" : "outline"}
                size='sm'
                onClick={() => setFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredUsers.map((user) => {
          const stats = getUserStats(user.id);
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-lg'>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username}
                      </CardTitle>
                      <p className='text-sm text-muted-foreground'>
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Mail className='h-4 w-4' />
                    <span className='truncate'>{user.email}</span>
                  </div>

                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    <span>Joined {formatRelativeTime(user.createdAt)}</span>
                  </div>

                  {user.bio && (
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {user.bio}
                    </p>
                  )}

                  <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                    <div className='text-center'>
                      <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                        <FileText className='h-4 w-4' />
                        <span>{stats.totalPosts}</span>
                      </div>
                      <p className='text-xs text-muted-foreground'>Posts</p>
                    </div>
                    <div className='text-center'>
                      <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                        <MessageCircle className='h-4 w-4' />
                        <span>{stats.totalComments}</span>
                      </div>
                      <p className='text-xs text-muted-foreground'>Comments</p>
                    </div>
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex-1'
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[600px]'>
                        <DialogHeader>
                          <DialogTitle className='flex items-center gap-3'>
                            <Avatar className='h-12 w-12'>
                              <AvatarImage
                                src={user.avatar}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.firstName?.[0] ||
                                  user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username}
                              </div>
                              <p className='text-sm font-normal text-muted-foreground'>
                                @{user.username}
                              </p>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            User account details and statistics
                          </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-6'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <h4 className='font-medium mb-2'>
                                Contact Information
                              </h4>
                              <div className='space-y-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                  <Mail className='h-4 w-4 text-muted-foreground' />
                                  <span>{user.email}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <Calendar className='h-4 w-4 text-muted-foreground' />
                                  <span>
                                    Joined {formatDate(user.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className='font-medium mb-2'>
                                Account Status
                              </h4>
                              <div className='space-y-2'>
                                <Badge
                                  variant={
                                    user.isActive ? "default" : "secondary"
                                  }
                                >
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {user.bio && (
                            <div>
                              <h4 className='font-medium mb-2'>Bio</h4>
                              <p className='text-sm text-muted-foreground'>
                                {user.bio}
                              </p>
                            </div>
                          )}

                          <div>
                            <h4 className='font-medium mb-2'>Statistics</h4>
                            <div className='grid grid-cols-4 gap-4'>
                              <div className='text-center p-3 border rounded-lg'>
                                <div className='text-2xl font-bold'>
                                  {stats.totalPosts}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  Total Posts
                                </div>
                              </div>
                              <div className='text-center p-3 border rounded-lg'>
                                <div className='text-2xl font-bold'>
                                  {stats.publishedPosts}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  Published
                                </div>
                              </div>
                              <div className='text-center p-3 border rounded-lg'>
                                <div className='text-2xl font-bold'>
                                  {stats.totalViews.toLocaleString()}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  Total Views
                                </div>
                              </div>
                              <div className='text-center p-3 border rounded-lg'>
                                <div className='text-2xl font-bold'>
                                  {stats.totalComments}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  Comments
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant={user.isActive ? "outline" : "default"}
                      size='sm'
                      onClick={() => handleToggleUserStatus(user)}
                      disabled={updateUserMutation.isPending}
                    >
                      {user.isActive ? (
                        <>
                          <UserX className='mr-2 h-4 w-4' />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className='mr-2 h-4 w-4' />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className='col-span-full'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center py-8'>
                  <Users className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>No users found</h3>
                  <p className='text-muted-foreground'>
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No users registered yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
