"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message || "Signup failed. Please try again.");
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.session) {
          // User is immediately logged in (email confirmation disabled)
          router.push("/admin/dashboard");
          router.refresh();
        } else {
          // Email confirmation required - redirect to verification with email parameter
          router.push(`/auth/verification?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`
        }
      });

      if (error) {
        setError(error.message || "Google signup failed. Please try again.");
      }
      // Note: If successful, the page will redirect to Google OAuth, so we won't reach this point
    } catch (error: any) {
      console.error("Google signup failed:", error);
      setError(error.message || "Google signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2a2a2a] mb-2">
        Create your account
      </h2>
      <p className="text-[#6a6a6a] text-sm mb-6">
        Start building your online store today
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label
            htmlFor="fullname"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Full Name
          </Label>
          <Input
            id="fullname"
            type="text"
            placeholder="Enter your full name"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label
            htmlFor="signup-email"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label
            htmlFor="signup-password"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Password
          </Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a Password"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label
            htmlFor="confirm-password"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <Checkbox id="terms" className="mt-0.5" required />
          <label
            htmlFor="terms"
            className="text-sm text-[#4a4a4a] leading-tight cursor-pointer"
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#3a3a3a] hover:bg-[#2a2a2a] text-white font-medium text-base disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
        
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 h-px bg-[#e0e0e0]" />
          <span className="text-[#6a6a6a] text-xs sm:text-sm whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-[#e0e0e0]" />
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full h-12 border-[#e0e0e0] hover:bg-[#f5f5f5] bg-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle />
          <span className="ml-2">{isLoading ? 'Connecting...' : 'Sign up with Google'}</span>
        </Button>
      </form>
    </div>
  );
}
