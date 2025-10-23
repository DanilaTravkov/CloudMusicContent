import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Music2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { register, type RegisterRequest } from '../lib/authApi';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.username || 
        !formData.email || !formData.password || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password strength (basic)
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        given_name: formData.firstName,
        family_name: formData.lastName,
        birthdate: formData.dateOfBirth // Already in YYYY-MM-DD format from date input
      };

      console.log('Registering user with data:', {
        username: registerData.username,
        email: registerData.email,
        given_name: registerData.given_name,
        family_name: registerData.family_name,
        birthdate: registerData.birthdate
      });

      const response = await register(registerData);
      
      console.log('Registration successful:', response);
      toast.success('Registration successful! Please check your email for verification instructions.');
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please verify your email before signing in.',
          username: formData.username 
        }
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error instanceof Error) {
        // Handle specific error messages from the API
        if (error.message.includes('username')) {
          toast.error('Username is already taken. Please choose a different one.');
        } else if (error.message.includes('email')) {
          toast.error('Email is already registered. Please use a different email or try logging in.');
        } else if (error.message.includes('password')) {
          toast.error('Password does not meet requirements. Please try a stronger password.');
        } else {
          toast.error(error.message || 'Registration failed. Please try again.');
        }
      } else {
        toast.error('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-full mb-4">
            <Music2 className="size-12 text-white" />
          </div>
          <h1 className="text-white text-4xl mb-2">Join StreamHub</h1>
          <p className="text-purple-200">Create your account and start exploring</p>
        </div>        <Card className="border-white/20 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader>
            <Link
              to="/login"
              className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 w-fit"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
            <CardTitle>Create Account</CardTitle>            <CardDescription className="text-purple-200">
              Fill in your details to get started. You'll receive an email verification link after registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <p className="text-xs text-purple-300">Username must be 3-30 characters and unique</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <p className="text-xs text-purple-300">Email must be unique in the system</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={8}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <p className="text-xs text-purple-300">Minimum 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
