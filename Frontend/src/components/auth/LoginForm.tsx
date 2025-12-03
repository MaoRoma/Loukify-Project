"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Login failed. Please check your credentials.");
        return;
      }

      if (data?.session) {
        // Redirect to admin dashboard after successful login
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
        setError(error.message || "Google login failed. Please try again.");
      }
      // Note: If successful, the page will redirect to Google OAuth, so we won't reach this point
    } catch (error: any) {
      console.error("Google login failed:", error);
      setError(error.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2a2a2a] mb-2">
        Log in to your account
      </h2>
      <p className="text-[#6a6a6a] text-sm mb-6">
        Enter your email and password to access your dashboard
      </p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label
            htmlFor="login-email"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Email
          </Label>
          <Input
            id="login-email"
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
            htmlFor="login-password"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm text-[#4a4a4a] cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgotpassword"
            className="text-sm text-[#6a6a6a] hover:text-[#2a2a2a] transition-colors"
          >
            Forgot password?
          </Link>
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
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <br />
      <br />
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 h-px bg-[#e0e0e0]" />
          <span className="text-[#6a6a6a] text-xs sm:text-sm whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-[#e0e0e0]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full sm:flex-1 h-11 sm:h-12 border-[#e0e0e0] hover:bg-[#f5f5f5] bg-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle />
            <span className="ml-2">{isLoading ? 'Connecting...' : 'Google'}</span>
          </Button>
        </div>

        <p className="text-center text-xs sm:text-sm text-[#9a9a9a] px-4">
          Protected by industry-standard security measures
        </p>
      </div>
    </div>
  );
}
