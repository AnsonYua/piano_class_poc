"use client";

import React, { FC } from "react";
import ExperiencesSearchForm from "./(experiences-search-form)/ExperiencesSearchForm";
import { useAuth } from "@/hooks/useAuth";
import { Route } from "@/routers/types";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: SearchTab;
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Experiences",
  currentPage = "Experiences",
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
      <div className="w-full max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <ExperiencesSearchForm onSearch={handleSearch} />
      </div>
    );
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-10xl py-5 lg:py-0 ${className}`}
      data-nc-id="HeroSearchForm"
    >
      {renderHeroSearchForm()}
    </div>
  );
};

export default HeroSearchForm;
