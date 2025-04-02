"use client";

import React, { FC } from "react";
import ExperiencesSearchForm from "./(experiences-search-form)/ExperiencesSearchForm";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: "Stays" | "Experiences" | "Cars" | "Flights";
  currentPage?: "Stays" | "Experiences" | "Cars" | "Flights";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Experiences",
  currentPage = "Experiences",
}) => {
  const renderHeroSearchForm = () => {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ExperiencesSearchForm />
      </div>
    );
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
      data-nc-id="HeroSearchForm"
    >
      {renderHeroSearchForm()}
    </div>
  );
};

export default HeroSearchForm;
