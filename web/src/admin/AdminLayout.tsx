import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  PenTool,
  Plus,
  BarChart3,
  Tags,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className='fixed inset-0 bg-background/80 backdrop-blur-sm'
          onClick={() => setSidebarOpen(false)}
        />
        <div className='fixed left-0 top-0 bottom-0 w-64 bg-background border-r'>
          <div className='flex h-16 items-center justify-between px-6'>
            <Link to='/' className='flex items-center space-x-2'>
              <PenTool className='h-6 w-6 text-primary' />
              <span className='font-bold'>DevBlog Admin</span>
            </Link>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <nav className='mt-8 px-4'>
            <ul className='space-y-2'>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className='h-4 w-4' />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-background lg:border-r'>
        <div className='flex h-16 items-center px-6'>
          <Link to='/' className='flex items-center space-x-2'>
            <PenTool className='h-6 w-6 text-primary' />
            <span className='font-bold'>DevBlog Admin</span>
          </Link>
        </div>
        <nav className='mt-8 px-4'>
          <ul className='space-y-2'>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className='lg:pl-64'>
        {/* Top bar */}
        <div className='sticky top-0 z-40 flex h-16 items-center gap-x-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 sm:px-6 lg:px-8'>
          <Button
            variant='ghost'
            size='sm'
            className='lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='h-4 w-4' />
          </Button>

          <div className='flex flex-1 items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-lg font-semibold'>
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Admin"}
              </h1>
            </div>

            <div className='flex items-center gap-4'>
              <Button asChild>
                <Link to='/admin/posts/new'>
                  <Plus className='mr-2 h-4 w-4' />
                  New Post
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>
                        {user?.firstName?.[0] ||
                          user?.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-medium'>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to='/' className='flex items-center'>
                      <Home className='mr-2 h-4 w-4' />
                      View Site
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to='/profile' className='flex items-center'>
                      <Settings className='mr-2 h-4 w-4' />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='p-4 sm:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
