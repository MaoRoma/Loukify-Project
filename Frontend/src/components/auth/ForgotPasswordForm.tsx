"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2a2a2a] mb-2">
        Forgot your password?
      </h2>
      <p className="text-[#6a6a6a] text-sm mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form className="space-y-5">
        <div>
          <Label
            htmlFor="forgot-email"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Email
          </Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="Enter your email"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#3a3a3a] hover:bg-[#2a2a2a] text-white font-medium text-base"
        >
          Send Reset Link
        </Button>

        <div className="text-center pt-2">
          <Link
            href="/auth/login"
            className="text-sm text-[#6a6a6a] hover:text-[#2a2a2a] transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
