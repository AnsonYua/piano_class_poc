'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';

const MyReservationsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the recent tab by default
    router.push('/my-reservations/recent' as Route);
  }, [router]);

  return null;
};

export default MyReservationsPage; 