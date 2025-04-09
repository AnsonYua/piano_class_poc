import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';

export const useAuthRedirect = () => {
  const router = useRouter();

  // This function will be called directly in the component
  const checkAuth = useCallback(() => {
    const studentToken = localStorage.getItem('student_auth_token');
    const teacherToken = localStorage.getItem('teacher_auth_token');
    const shopOwnerToken = localStorage.getItem('shop_owner_auth_token');

    if (studentToken) {
      router.push('/' as Route<string>);
    } else if (teacherToken) {
      router.push('/teacher-admin' as Route<string>);
    } else if (shopOwnerToken) {
      router.push('/shop-owner-admin' as Route<string>);
    }
  }, [router]);

  return { checkAuth };
}; 