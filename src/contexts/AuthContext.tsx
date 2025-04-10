"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { UserTypeUtils, UserType } from '@/utils/UserTypeUtils';
import { ApiUtils } from '@/utils/ApiUtils';

interface UserProfile {
  name: string;
  contactNumber: string;
  role: string;
  student: any[];
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: { user: UserProfile } | null;
  userType: UserType | null;
  setUserType: (type: UserType | null) => void;
  logout: () => void;
  checkAuth: (pathname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a singleton instance to track if profile has been fetched
let profileFetchPromise: Promise<void> | null = null;
let cachedProfile: { user: UserProfile } | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ user: UserProfile } | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const router = useRouter();
  const isMounted = useRef(false);

  const fetchProfile = async (type: string, token: string) => {
    try {
      const response = await fetch(ApiUtils.getUserProfileUrl(type), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setUserProfile(data);
      cachedProfile = data;
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem(`${type}_auth_token`);
      setIsAuthenticated(false);
      setUserProfile(null);
      cachedProfile = null;
    }
  };

  const checkAuth = async (pathname: string) => {
    // If we already have a profile and it's for the correct user type, just return
    if (cachedProfile && userType && UserTypeUtils.isUserTypeForPath(userType, pathname)) {
      return;
    }
    
    setIsLoading(true);
    
    // Determine user type based on URL path using the utility class
    const currentUserType = UserTypeUtils.getUserTypeFromPathname(pathname);
    setUserType(currentUserType);
    
    // Get token from local storage
    const token = localStorage.getItem(`${currentUserType}_auth_token`);
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // Create a promise for profile fetching if it doesn't exist
    if (!profileFetchPromise) {
      profileFetchPromise = fetchProfile(currentUserType, token);
    }
    
    // Wait for the profile fetch to complete
    await profileFetchPromise;
    setIsLoading(false);
  };

  useEffect(() => {
    // Skip if component is unmounted
    if (isMounted.current) return;
    
    isMounted.current = true;
    
    // Initial auth check
    const pathname = window.location.pathname;
    checkAuth(pathname);
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  const logout = () => {
    if (userType) {
      // Use the utility class to handle logout
      UserTypeUtils.handleLogout(userType, router);
      
      setUserProfile(null);
      cachedProfile = null;
      setIsAuthenticated(false);
      profileFetchPromise = null; // Reset the promise on logout
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      userProfile,
      userType,
      setUserType,
      logout,
      checkAuth
    }}>
      {isLoading && <LoadingScreen />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 