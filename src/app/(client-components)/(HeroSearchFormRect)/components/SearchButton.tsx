"use client";

import React, { FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SearchButtonProps {
  className?: string;
  onClick?: () => void;
}

const SearchButton: FC<SearchButtonProps> = ({
  className = "",
  onClick,
}) => {
  return (
    <ButtonPrimary
      className={`flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
      <span>搜尋</span>
    </ButtonPrimary>
  );
};

export default SearchButton; 