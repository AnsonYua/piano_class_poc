"use client";

import React, { FC } from "react";
import ExperiencesSearchForm from "../(HeroSearchForm)/(experiences-search-form)/ExperiencesSearchForm";
import { useAuth } from "@/hooks/useAuth";
import { Route } from "@/routers/types";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormRectProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: SearchTab;
  defaultValues?: {
    section?: string;
    district?: string;
    date?: string;
  };
}

const HeroSearchFormRect: FC<HeroSearchFormRectProps> = ({
  className = "",
  currentTab = "Experiences",
  currentPage = "Experiences",
  defaultValues = {},
}) => {
  const { isAuthenticated, isLoading, redirectToLogin } = useAuth();

  const handleSearch = () => {
    if (isLoading) return;
    if (!isAuthenticated) {
      // User is not logged in, redirect to login page
      redirectToLogin();
      return;
    }
    
    // User is logged in, proceed with search
    console.log("User is logged in, proceeding with search");
  };

  const renderHeroSearchForm = () => {
    return (
      <div className="w-full max-w-10xl mx-auto">
        <ExperiencesSearchForm onSearch={handleSearch} defaultValues={defaultValues} />
      </div>
    );
  };

  return (
    <div
      className={`nc-HeroSearchFormRect w-full max-w-10xl py-2 ${className}`}
      data-nc-id="HeroSearchFormRect"
    >
      {renderHeroSearchForm()}
    </div>
  );
};

export default HeroSearchFormRect; 