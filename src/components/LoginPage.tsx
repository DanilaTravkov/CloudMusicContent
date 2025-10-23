import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Music2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle registration success message
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Pre-fill username if provided
      if (location.state.username) {
        setUsername(location.state.username);
      }
      // Clear the state to prevent showing the message again
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('[LoginPage] Attempting login with username:', username);
      await login(username, password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('[LoginPage] Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-full mb-4">
            <Music2 className="size-12 text-white" />
          </div>
          <h1 className="text-white text-4xl mb-2">StreamHub</h1>
          <p className="text-purple-200">Your music, unlimited</p>
        </div>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription className="text-purple-200">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <p className="text-purple-200">
                  Demo: Use "admin" for admin access, any other username for regular user
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-purple-200">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-white underline hover:text-purple-100"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
