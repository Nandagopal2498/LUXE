'use client';

import React, { useEffect } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useStore } from '@/components/ecommerce/store';
import type { User } from '@/components/ecommerce/types';

function AuthSync() {
  const { data: session, status } = useSession();
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: (session.user as any).id,
        email: session.user.email!,
        name: session.user.name,
        avatar: session.user.image,
        phone: null,
        role: (session.user as any).role || 'user',
      });
    } else if (status === 'unauthenticated') {
      // Only clear user if they explicitly signed out
      // Don't clear on initial load when session hasn't been checked yet
    }
  }, [session, status, setUser]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}

export { signIn, signOut };
