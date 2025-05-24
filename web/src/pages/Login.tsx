import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PenTool, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      login(user, access_token);
      console.info("Welcome back!");
      navigate("/");
    },
    onError: (error: any) => {
      console.error(error.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5'>
      <div className='w-full max-w-md px-4'>
        <div className='text-center mb-8'>
          <Link to='/' className='inline-flex items-center space-x-2 mb-4'>
            <PenTool className='h-8 w-8 text-primary' />
            <span className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              DevBlog
            </span>
          </Link>
          <h1 className='text-3xl font-bold'>Welcome back</h1>
          <p className='text-muted-foreground mt-2'>
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  placeholder='Enter your username'
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-muted-foreground'>
                Don't have an account?{" "}
                <Link
                  to='/register'
                  className='font-medium text-primary hover:underline'
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className='mt-4 text-center'>
              <Link
                to='/forgot-password'
                className='text-sm text-primary hover:underline'
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className='text-center mt-8'>
          <p className='text-xs text-muted-foreground'>
            Demo credentials: admin / password123
          </p>
        </div>
      </div>
    </div>
  );
}
