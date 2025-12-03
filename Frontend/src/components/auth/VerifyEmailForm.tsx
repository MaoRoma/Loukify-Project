"use client";

import type React from "react";

import { useState, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export function VerifyEmailForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char;
      }
    });
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = code.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      setError('Email not found. Please go back to signup/login.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Supabase's verifyOtp method
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'email'
      });

      if (verifyError) {
        throw new Error(verifyError.message || 'Failed to verify OTP');
      }

      if (data.user && data.session) {
        // Successfully verified - redirect to dashboard
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email not found. Please go back to signup/login.');
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });

      if (resendError) {
        throw new Error(resendError.message || 'Failed to resend OTP');
      }

      alert('New verification code sent to your email!');
    } catch (error: any) {
      console.error('Resend failed:', error);
      setError(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2a2a2a] mb-2">
        Verify your email
      </h2>
      <p className="text-[#6a6a6a] text-sm mb-6">
        We've sent a 6-digit verification code to <strong>{email || 'your email address'}</strong>. Please
        enter it below.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[#2a2a2a] font-semibold mb-3 block text-sm">
            Verification Code
          </label>
          <div className="flex gap-2 justify-between">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-14 w-14 text-center text-xl font-semibold border-[#e0e0e0] bg-[#fafafa] focus:bg-white"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || code.join('').length !== 6}
          className="w-full h-12 bg-[#3a3a3a] hover:bg-[#2a2a2a] text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-[#6a6a6a]">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#2a2a2a] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
        </div>

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
