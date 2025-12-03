"use client";

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'seller' | 'customer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'customer' 
}) => {
  const { user, session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !session)) {
      router.push('/auth/login');
      return;
    }

    // If we need to check roles, we would do it here
    // For now, we just check if user is authenticated
  }, [user, session, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};