"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2a2a2a] mb-2">
        Reset your password
      </h2>
      <p className="text-[#6a6a6a] text-sm mb-6">
        Enter your new password below to reset your account password.
      </p>

      <form className="space-y-5">
        <div>
          <Label
            htmlFor="new-password"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            New Password
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Create a new password"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
          />
        </div>

        <div>
          <Label
            htmlFor="confirm-new-password"
            className="text-[#2a2a2a] font-semibold mb-2 block"
          >
            Confirm New Password
          </Label>
          <Input
            id="confirm-new-password"
            type="password"
            placeholder="Confirm your new password"
            className="h-12 border-[#e0e0e0] bg-[#fafafa] placeholder:text-[#9a9a9a]"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#3a3a3a] hover:bg-[#2a2a2a] text-white font-medium text-base"
        >
          Reset Password
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
