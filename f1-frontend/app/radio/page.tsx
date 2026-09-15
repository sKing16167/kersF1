'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RadioPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-center text-xs font-mono text-neutral-400">
      Redirecting to Overview...
    </div>
  );
}
