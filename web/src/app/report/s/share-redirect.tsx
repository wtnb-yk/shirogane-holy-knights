'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ShareRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/report');
  }, [router]);

  return null;
}
