import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export const LoginPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginData.usernameOrEmail,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Lakbay!",
        });
        
        setLocation("/");
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    if (provider === 'google') {
      // Log the attempt and redirect to Google OAuth
      console.log('Initiating Google OAuth redirect...');
      try {
        window.location.href = '/api/auth/google';
      } catch (error) {
        console.error('OAuth redirect error:', error);
        toast({
          title: "Login Error",
          description: "Unable to initiate Google login. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Facebook login - redirect to Facebook OAuth
      console.log('Initiating Facebook OAuth redirect...');
      try {
        window.location.href = '/api/auth/facebook';
      } catch (error) {
        console.error('Facebook OAuth redirect error:', error);
        toast({
          title: "Login Error",
          description: "Unable to initiate Facebook login. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="prada-button flex items-center text-gray-600 hover:text-black font-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO LAKBAY
          </Button>
        </div>

        {/* Login Card */}
        <div className="prada-card p-8">
          <div className="text-center mb-8">
            <h1 className="prada-heading text-3xl text-black mb-3 font-light">WELCOME BACK</h1>
            <p className="text-gray-600 font-light tracking-wide text-sm">Sign in to your Lakbay account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              type="button"
              variant="outline"
              className="prada-button w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-black font-light tracking-wider"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <FaGoogle className="w-4 h-4 text-red-500" />
              <span className="text-xs">CONTINUE WITH GOOGLE</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="prada-button w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-black font-light tracking-wider"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            >
              <FaFacebook className="w-4 h-4 text-blue-600" />
              <span className="text-xs">CONTINUE WITH FACEBOOK</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="usernameOrEmail" className="text-xs font-light text-gray-600 tracking-wider uppercase">
                Username or Email
              </Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder="Enter your username or email"
                value={loginData.usernameOrEmail}
                onChange={handleInputChange}
                required
                className="prada-input mt-2 h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-light text-gray-600 tracking-wider uppercase">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                  className="prada-input h-12 pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#D4AF37] hover:text-[#B8941F] font-medium">
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="prada-button prada-gold-accent w-full h-12 font-light tracking-wider text-xs"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>SIGNING IN...</span>
                </div>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#D4AF37] hover:text-[#B8941F] font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-[#D4AF37] hover:text-[#B8941F]">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#D4AF37] hover:text-[#B8941F]">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};