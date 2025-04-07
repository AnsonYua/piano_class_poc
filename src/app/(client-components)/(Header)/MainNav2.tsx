import React, { FC } from "react";
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
import { Popover, Transition } from "@headlessui/react";
export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = "" }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isVerifyOtpPage = pathname === "/verify-otp";
  const isMyReservationsPage = pathname.startsWith("/my-reservations");
  const isAccountPage = pathname.startsWith("/account");

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
            
            <div className="TemplatesDropdown hidden lg:block self-center">
              <Link 
                href="/my-reservations/recent" 
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
                href="/account" 
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
            {/* 
            <TemplatesDropdown />
            <LangDropdown />
            
            <Link
              href={"/add-listing" as Route<string>}
              className="self-center text-opacity-90 group px-4 py-2 border border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 rounded-full inline-flex items-center text-sm text-gray-700 dark:text-neutral-300 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              List your property
            </Link>

            <NotifyDropdown />
            <AvatarDropdown />
            */}
            {
            /*!isLoginPage && !isSignupPage && !isVerifyOtpPage && (
              <ButtonPrimary href="/listing-stay-map" 
                sizeClass="px-5 py-4 sm:px-7"
                className="my-5">
                登入
              </ButtonPrimary>
            )}*/} 
          </div>
          
          <div className="flex space-x-2 lg:hidden">
          <NotifyDropdown />
          <AvatarDropdown />
            { /*
            <NotifyDropdown />
            <AvatarDropdown />
            */}
            {!isLoginPage && !isSignupPage && !isVerifyOtpPage && (
              <ButtonPrimary href="/listing-stay-map" 
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
