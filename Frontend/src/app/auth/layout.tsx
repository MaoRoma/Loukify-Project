"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";
  const isSignupPage = pathname === "/auth/signup";

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-2xl mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#4a4a4a] hover:text-[#2a2a2a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to home</span>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/image/loukify.png"
            alt="Loukify Logo"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2a2a2a]">
          Loukify
        </h1>

        <p className="text-[#6a6a6a] text-sm sm:text-base text-center">
          Welcome back to your store builder
        </p>
      </div>

      {(isLoginPage || isSignupPage) && (
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 bg-[#e8e8e8] p-1 sm:p-1.5 rounded-full w-full max-w-lg">
          <Link
            className={`w-full px-6 sm:px-22 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
              isLoginPage
                ? "bg-white text-[#2a2a2a] shadow-sm"
                : "bg-transparent text-[#6a6a6a] hover:text-[#2a2a2a]"
            }`}
            href="/auth/login"
          >
            Log in
          </Link>
          <Link
            className={`w-full px-6 sm:px-22 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
              isSignupPage
                ? "bg-white text-[#2a2a2a] shadow-sm"
                : "bg-transparent text-[#6a6a6a] hover:text-[#2a2a2a]"
            }`}
            href="/auth/signup"
          >
            Sign up
          </Link>
        </div>
      )}

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
        {children}
      </div>
    </div>
  );
}
