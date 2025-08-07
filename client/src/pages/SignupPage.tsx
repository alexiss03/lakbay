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
      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to Lakbay! You can now start exploring amazing adventures.",
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'facebook' | 'google') => {
    setIsLoading(true);
    
    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: `${provider === 'facebook' ? 'Facebook' : 'Google'} Signup`,
        description: `Successfully created account with ${provider === 'facebook' ? 'Facebook' : 'Google'}!`,
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Social Signup Failed",
        description: `Unable to signup with ${provider === 'facebook' ? 'Facebook' : 'Google'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementCheck = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lakbay
          </Button>
        </div>

        {/* Signup Card */}
        <Card className="p-8 shadow-lg border-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Lakbay</h1>
            <p className="text-gray-600">Create your adventure account today</p>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-blue-50 border-gray-300"
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span className="font-medium">Sign up with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-blue-50 border-gray-300"
              onClick={() => handleSocialSignup('facebook')}
              disabled={isLoading}
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Sign up with Facebook</span>
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
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
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
                className="mt-1 h-12"
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                className="mt-1 h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={signupData.password}
                  onChange={handleInputChange}
                  required
                  className="h-12 pr-12"
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
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={signupData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="h-12 pr-12"
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
              className={`w-full h-12 font-semibold ${
                isFormValid
                  ? 'bg-[#D4AF37] hover:bg-[#B8941F] text-black'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-[#D4AF37] hover:text-[#B8941F] font-medium">
                  Sign in here
                </a>
              </Link>
            </p>
          </div>
        </Card>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms">
              <a className="text-[#D4AF37] hover:text-[#B8941F]">Terms of Service</a>
            </Link>{" "}
            and{" "}
            <Link href="/privacy">
              <a className="text-[#D4AF37] hover:text-[#B8941F]">Privacy Policy</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};