import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';
import { UserTypeUtils, UserType } from '@/utils/UserTypeUtils';

export const useAuthRedirect = () => {
  const router = useRouter();

  // This function will be called directly in the component
  const checkAuth = useCallback((pathname?: string) => {
    // Determine user type from pathname
    const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
    
    // Check only the token for the current user type
    const token = localStorage.getItem(`${userType}_auth_token`);
    
    if (token) {
      // Use UserTypeUtils to get the appropriate homepage URL
      const homepageUrl = UserTypeUtils.getHomepageUrl(userType);
      router.push(homepageUrl);
    }
  }, [router]);

  return { checkAuth };
}; 