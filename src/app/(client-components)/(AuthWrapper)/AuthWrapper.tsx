"use client";

import React, { FC } from "react";
import { useAuth } from "@/hooks/useAuth";
import HeroSearchForm from "../(HeroSearchForm)/HeroSearchForm";
import HeroSearchFormRect from "../(HeroSearchFormRect)/HeroSearchFormRect";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "@/routers/types";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

export interface AuthWrapperProps {
  className?: string;
}

const AuthWrapper: FC<AuthWrapperProps> = ({ className = "" }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
  
  // Construct the correct login path based on user type


  return (
    <div className={className}>
      {isLoading ? (
        <div className="w-full h-40 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
      ) : isAuthenticated ? (
        <HeroSearchFormRect />
      ) : (
        <HeroSearchForm />
      )}
    </div>
  );
};

export default AuthWrapper; 