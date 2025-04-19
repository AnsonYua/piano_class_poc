'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';
import LoadingScreen from '@/components/LoadingScreen';

const MyReservationsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the recent tab by default
    router.push('/my-reservations/recent' as Route);
  }, [router]);

  return <LoadingScreen />;

};

export default MyReservationsPage; 