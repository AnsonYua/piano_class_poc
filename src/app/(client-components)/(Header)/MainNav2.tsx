import React, { FC, useEffect, useState } from "react";
import Logo from "@/shared/Logo";
import MenuBar from "@/shared/MenuBar";
import LangDropdown from "./LangDropdown";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import DropdownTravelers from "./DropdownTravelers";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import Link from "next/link";
import TemplatesDropdown from "./TemplatesDropdown";
import { Route } from "@/routers/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";

export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = "" }) => {
  const pathname = usePathname() || "";
  const isLoginPage = pathname.endsWith("/login");
  const isSignupPage = pathname.endsWith("/signup");
  const isVerifyOtpPage = pathname.endsWith("/verify-otp");
  const isMyReservationsPage = pathname.endsWith("/my-reservations");
  const isAccountPage = pathname.includes("/account");
  
  const { isAuthenticated, isLoading, userType, checkAuth } = useAuth();
  
  // Determine user type based on URL path using the utility class
  const currentUserType = UserTypeUtils.getUserTypeFromPathname(pathname);
  
  // Initialize localAuth state without accessing localStorage
  const [localAuth, setLocalAuth] = useState(false);

  // Get login URL based on user type
  const getLoginUrl = (type: UserType | null): Route<string> => {
    // If type is provided, use it; otherwise use the current path to determine user type
    const userTypeToUse = type || UserTypeUtils.getUserTypeFromPathname(pathname);
    
    // Use the base path from UserTypeUtils and append '/login'
    const basePath = UserTypeUtils.getHomepageUrl(userTypeToUse);
    return `${basePath}/login` as Route<string>;
  };

  // Get account URL based on user type
  const getAccountUrl = (type: UserType | null): Route<string> => {
    // If type is provided, use it; otherwise use the current path to determine user type
    const userTypeToUse = type || UserTypeUtils.getUserTypeFromPathname(pathname);
    
    switch (userTypeToUse) {
      case 'teacher':
        return '/teacher-admin/account' as Route<string>;
      case 'shopOwner':
        return '/shop-owner-admin/account' as Route<string>;
      case 'student':
      default:
        return '/account' as Route<string>;
    }
  };

  // Check auth on pathname change
  useEffect(() => {
    checkAuth(pathname);
  }, [pathname, checkAuth]);

  // Check localStorage only on client side
  useEffect(() => {
    // This effect only runs on the client side
    const token = localStorage.getItem(`${currentUserType}_auth_token`);
    setLocalAuth(!!token);
  }, [currentUserType]);

  // Use localAuth for immediate UI rendering, but still respect the actual auth state
  const showAuthUI = localAuth || isAuthenticated;

  // Don't render anything while loading to prevent flashing
  if (isLoading) {
    return <div className="h-20"></div>; // Add a placeholder with the same height as the nav
  }

  return (
    <div className={`MainNav2 relative z-10 ${className}`}>
      <div className="px-4 h-20 lg:container flex justify-between">
        <div className="hidden md:flex justify-start flex-1 space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo className="w-24 self-center" />
          <div className="hidden lg:block self-center h-10 border-l border-neutral-300 dark:border-neutral-500"></div>
          <div className="hidden lg:flex ">
            <DropdownTravelers />
          </div>
        </div>

        <div className="self-center lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
          <HeroSearchForm2MobileFactory />
        </div>

        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
       
          <div className="hidden lg:flex space-x-1">
            
            {showAuthUI && (
              <>
                <div className="TemplatesDropdown hidden lg:block self-center">
                  <Link 
                    href={"/my-reservations/recent" as Route<string>} 
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isMyReservationsPage 
                        ? "text-primary-6000 underline" 
                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    我的預約
                  </Link>
                </div>
                <div className="TemplatesDropdown hidden lg:block self-center">
                  <Link 
                    href={getAccountUrl(userType)} 
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isAccountPage 
                        ? "text-primary-6000 underline" 
                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    帳號設定
                  </Link>
                </div>

                <NotifyDropdown />
                <AvatarDropdown />
              </>
            )}
            
            {!showAuthUI && !isLoginPage && !isSignupPage && !isVerifyOtpPage && (
              <ButtonPrimary href={getLoginUrl(userType)} 
                sizeClass="px-5 py-4 sm:px-7"
                className="my-5">
                登入
              </ButtonPrimary>
            )}
          </div>
          
          <div className="flex space-x-2 lg:hidden">
            {showAuthUI && (
              <>
                <NotifyDropdown />
                <AvatarDropdown />
              </>
            )}
            
            {!showAuthUI && !isLoginPage && !isSignupPage && !isVerifyOtpPage && (
              <ButtonPrimary href={getLoginUrl(userType)} 
                sizeClass="px-5 py-4 sm:px-7"
                className="my-5">
                登入
              </ButtonPrimary>
            )}
            
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;