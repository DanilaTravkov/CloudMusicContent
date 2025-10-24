import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Music2, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { confirmEmail, type ConfirmRequest, type RegisterRequest } from '../lib/authApi';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

export function ConfirmEmailPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from navigation state
  const userData = location.state?.userData as RegisterRequest | undefined;
  const username = userData?.username || '';

  // Redirect to register if no user data
  useEffect(() => {
    if (!userData) {
      toast.error('Please complete registration first');
      navigate('/register');
    }
  }, [userData, navigate]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit verification code');
      return;
    }

    if (!username) {
      toast.error('Username is missing. Please register again.');
      navigate('/register');
      return;
    }

    setIsLoading(true);

    try {
      const confirmData: ConfirmRequest = {
        username: username,
        confirmation_code: code
      };

      console.log('Confirming email with:', { username });

      const response = await confirmEmail(confirmData);
      
      console.log('Email confirmation successful:', response);
      toast.success('Email verified successfully! You can now sign in.');
      
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Email verified successfully! You can now sign in.',
          username: username 
        }
      });
      
    } catch (error) {
      console.error('Email confirmation failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          toast.error('Verification code has expired. Please request a new one.');
        } else if (error.message.includes('invalid')) {
          toast.error('Invalid verification code. Please check and try again.');
        } else if (error.message.includes('already confirmed')) {
          toast.error('Email is already verified. You can sign in now.');
          navigate('/login', { state: { username } });
        } else {
          toast.error(error.message || 'Verification failed. Please try again.');
        }
      } else {
        toast.error('Verification failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-full mb-4">
            <Music2 className="size-12 text-white" />
          </div>
          <h1 className="text-white text-4xl mb-2">Verify Email</h1>
          <p className="text-purple-200 text-center">
            We've sent a 6-digit code to your email
          </p>
        </div>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader>
            <Link
              to="/register"
              className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 w-fit"
            >
              <ArrowLeft className="size-4" />
              Back to registration
            </Link>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              Email Verification
            </CardTitle>
            <CardDescription className="text-purple-200">
              Enter the 6-digit verification code sent to{' '}
              <span className="font-medium text-white">{userData.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-center block">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                      <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                      <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                      <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                      <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                      <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-purple-300 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || code.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
