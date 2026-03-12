import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to send reset request");
      }

      toast({
        title: "Reset link sent",
        description: `If ${email} exists, a reset link has been sent.`,
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message || "Unable to process reset request right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen view-shell flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="prada-heading text-3xl font-light mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full prada-gold-accent text-black" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[#D4AF37] hover:text-[#B8941F]">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
