"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/login?error=Authentication failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          router.push('/admin/dashboard');
        } else {
          // No session found, redirect to login
          router.push('/auth/login?error=No session found');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/auth/login?error=Unexpected error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}