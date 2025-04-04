import React, { FC } from "react";
import Logo from "@/shared/Logo";
import Navigation from "@/shared/Navigation/Navigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "@/shared/ButtonPrimary";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import LangDropdown from "./LangDropdown";
import { usePathname } from "next/navigation";

export interface MainNav1Props {
  className?: string;
}

const MainNav1: FC<MainNav1Props> = ({ className = "" }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-start flex-1 space-x-4 sm:space-x-10">
          <Logo className="w-24 self-center" />
          <Navigation />
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Mobile Logo - Always visible */}
          <Logo className="w-24" />
          
          {/* Mobile Title or Search */}
          {isLoginPage ? (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Login</span>
            </div>
            
          ) : (
            <div className="flex-1 max-w-lg mx-auto px-3">
              <HeroSearchForm2MobileFactory />
            </div>
          )}
          
          {/* Mobile Menu */}
          <div className="flex items-center">
            <SwitchDarkMode />
            <div className="px-0.5" />
            <MenuBar />
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex space-x-0.5">
            <SwitchDarkMode />
            <SearchDropdown className="flex items-center" />
            <div className="px-1" />
            {!isLoginPage && (
              <ButtonPrimary className="self-center" href="/login">
                Sign up
              </ButtonPrimary>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
