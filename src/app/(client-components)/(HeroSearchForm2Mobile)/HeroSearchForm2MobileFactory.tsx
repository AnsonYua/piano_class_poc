"use client";

import React from "react";
import { PathName } from "@/routers/types";
import HeroSearchForm2Mobile from "./HeroSearchForm2Mobile";
import HeroSearchForm2RealEstateMobile from "./HeroSearchForm2RealEstateMobile";
import { usePathname } from "next/navigation";
import CommonTopBar from "../(Header)/CommonTopBar";

const PAGES_REAL_ESTATE: PathName[] = [
  "/home-2",
  "/listing-real-estate",
  "/listing-real-estate-map",
];

const HeroSearchForm2MobileFactory = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes('/teacher-admin');
  const isShopOwnerPage = pathname?.includes('/shop-owner-admin');
  const fontText = isTeacherPage ? "導師" : isShopOwnerPage ? "琴行" : "家長或同學";
  const fontTextDefault = isTeacherPage ? "導師" : isShopOwnerPage ? "琴行" : "";
  
  if (pathname === "/login" || 
      pathname === "/teacher-admin/login" ||
      pathname === "/shop-owner-admin/login" 
  ) {
    
    return <CommonTopBar title={`${fontTextDefault}登入`} className="nc-LoginTopBar" />;
  } 
  
  
  if (pathname === "/forgot-password"||
      pathname === "/teacher-admin/forgot-password" ||
      pathname === "/shop-owner-admin/forgot-password"
  ) {
    return <CommonTopBar title={`忘記密碼`} className="nc-LoginTopBar" />;
  }

  if (pathname === "/reset-password"||
      pathname === "/teacher-admin/reset-password" ||
      pathname === "/shop-owner-admin/reset-password"
  ) {
    return <CommonTopBar title="重設密碼" className="nc-LoginTopBar" />;
  }


  if (pathname === "/reset-password-success"||
    pathname === "/teacher-admin/reset-password-success" ||
    pathname === "/shop-owner-admin/reset-password-success"
  ) {
    return <CommonTopBar title="重設密碼" className="nc-LoginTopBar" />;
  }

  if (pathname === "/verify-otp"||
    pathname === "/teacher-admin/verify-otp" ||
    pathname === "/shop-owner-admin/verify-otp"
  ) {
    return <CommonTopBar title="" className="nc-LoginTopBar" />;
  }


  if (pathname === "/signup") {
    return <CommonTopBar title="創建帳戶" className="nc-SignUpTopBar" />;
  }
  
  if (pathname === "/verify-otp") {
    return <CommonTopBar title="創建帳戶" className="nc-SignUpTopBar" />;
  }

  if (PAGES_REAL_ESTATE.includes(pathname as PathName)) {
    return <HeroSearchForm2RealEstateMobile />;
  }
  return <HeroSearchForm2Mobile />;
};

export default HeroSearchForm2MobileFactory;
