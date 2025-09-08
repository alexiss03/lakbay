import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";

export const SignupPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const passwordRequirements = {
    length: signupData.password.length >= 8,
    uppercase: /[A-Z]/.test(signupData.password),
    lowercase: /[a-z]/.test(signupData.password),
    number: /\d/.test(signupData.password),
    match: signupData.password === signupData.confirmPassword && signupData.password.length > 0
  };

  const isFormValid = Object.values(passwordRequirements).every(Boolean) && 
                     signupData.username.length >= 3 && 
                     signupData.email.includes('@');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Lakbay! You can now start exploring amazing adventures.",
        });
        
        setLocation("/");
      } else {
        toast({
          title: "Signup Failed",
          description: data.error || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'facebook' | 'google') => {
    if (provider === 'google') {
      // Log and redirect to Google OAuth
      console.log('Initiating Google OAuth signup redirect...');
      try {
        window.location.href = '/api/auth/google';
      } catch (error) {
        console.error('OAuth signup redirect error:', error);
        toast({
          title: "Signup Error",
          description: "Unable to initiate Google signup. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Facebook signup - redirect to Facebook OAuth
      console.log('Initiating Facebook OAuth signup redirect...');
      try {
        window.location.href = '/api/auth/facebook';
      } catch (error) {
        console.error('Facebook OAuth signup redirect error:', error);
        toast({
          title: "Signup Error",
          description: "Unable to initiate Facebook signup. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const RequirementCheck = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="prada-button flex items-center text-gray-600 hover:text-black font-light tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-xs uppercase">Back to Lakbay</span>
          </Button>
        </div>

        {/* Signup Card */}
        <div className="prada-card p-10">
          <div className="text-center mb-8">
            <h1 className="prada-heading text-3xl text-black mb-3 font-light">JOIN LAKBAY</h1>
            <p className="text-gray-600 font-light tracking-wide text-sm">Create your adventure account today</p>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              type="button"
              variant="outline"
              className="prada-button w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-black font-light tracking-wider"
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <FaGoogle className="w-4 h-4 text-red-500" />
              <span className="text-xs">SIGN UP WITH GOOGLE</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="prada-button w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-black font-light tracking-wider"
              onClick={() => handleSocialSignup('facebook')}
              disabled={isLoading}
            >
              <FaFacebook className="w-4 h-4 text-blue-600" />
              <span className="text-xs">SIGN UP WITH FACEBOOK</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-xs font-light text-gray-600 tracking-wider uppercase">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a unique username"
                value={signupData.username}
                onChange={handleInputChange}
                required
                className="prada-input mt-2 h-12"
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-light text-gray-600 tracking-wider uppercase">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={signupData.email}
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
                  placeholder="Create a secure password"
                  value={signupData.password}
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

              {/* Password Requirements */}
              {signupData.password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-1">
                  <RequirementCheck met={passwordRequirements.length} text="At least 8 characters" />
                  <RequirementCheck met={passwordRequirements.uppercase} text="One uppercase letter" />
                  <RequirementCheck met={passwordRequirements.lowercase} text="One lowercase letter" />
                  <RequirementCheck met={passwordRequirements.number} text="One number" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-light text-gray-600 tracking-wider uppercase">
                Confirm Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={signupData.confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
              </div>

              {signupData.confirmPassword && (
                <div className="mt-2">
                  <RequirementCheck met={passwordRequirements.match} text="Passwords match" />
                </div>
              )}
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className={`prada-button w-full h-12 font-light tracking-wider text-xs ${
                isFormValid
                  ? 'prada-gold-accent'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>CREATING ACCOUNT...</span>
                </div>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D4AF37] hover:text-[#B8941F] font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-[#D4AF37] hover:text-[#B8941F]">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#D4AF37] hover:text-[#B8941F]">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};