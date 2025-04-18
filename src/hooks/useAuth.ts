"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ApiUtils } from "@/utils/ApiUtils";
import { usePathname } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Callback function to be called when profile is loaded
  const [profileCallback, setProfileCallback] = useState<((profile: any) => void) | null>(null);

  // Function to register a callback that will be called when profile is loaded
  const onProfileLoaded = useCallback((callback: (profile: any) => void) => {
    setProfileCallback(callback);
    
    // If profile is already loaded, call the callback immediately
    if (userProfile) {
      callback(userProfile);
    }
    
    // Return cleanup function
    return () => setProfileCallback(null);
  }, [userProfile]);

  useEffect(() => {
    // Check if user is logged in by looking for a token in localStorage
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Get all possible tokens
      const studentToken = localStorage.getItem('student_auth_token');
      const teacherToken = localStorage.getItem('teacher_auth_token');
      const shopOwnerToken = localStorage.getItem('shop_owner_auth_token');
      const hostAdminToken = localStorage.getItem('host_admin_auth_token');
      
      // Determine user type and token
      let userType = 'student';
      let token = studentToken;
  
      /*
      if (teacherToken) {
        userType = 'teacher';
        token = teacherToken;
      } else if (shopOwnerToken) {
        userType = 'shop_owner';
        token = shopOwnerToken;
      } else if (hostAdminToken) {
        userType = 'host_admin';
        token = hostAdminToken;
      }*/
      
            
      if(pathname?.includes("/teacher-admin")) {;
        userType = 'teacher';
        token = teacherToken;
      }
      if(pathname?.includes("/shop-owner-admin")) {;
        userType = 'shop_owner';
        token = shopOwnerToken;
      }
      if(pathname?.includes("/host-admin")) {;
        userType = 'host_admin';
        token = hostAdminToken;
      }

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Call your custom getProfile endpoint
        const response = await fetch(ApiUtils.getUserProfileUrl(userType), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const profile = await response.json();
        setUserProfile(profile);
        setIsAuthenticated(true);
        
        // Call the registered callback if it exists
        if (profileCallback) {
          profileCallback(profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Clear the token on error
        localStorage.removeItem(`${userType}_auth_token`);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [profileCallback, pathname]);

  const redirectToLogin = () => {
    router.push("/login" as any); // or as RouteImpl<"/login">
  };

  return {
    isAuthenticated,
    isLoading,
    userProfile,
    redirectToLogin,
    onProfileLoaded
  };
}