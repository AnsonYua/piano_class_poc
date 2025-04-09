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
  
  if (pathname && pathname.endsWith("/login")) {
    const title = pathname.includes('/teacher-admin') ? `${fontTextDefault}登入` : pathname.includes('/shop-owner-admin') ? `${fontTextDefault}登入` : `${fontTextDefault}登入`;
    return <CommonTopBar title={title} className="nc-LoginTopBar" />;
  } 

  if (pathname && pathname.endsWith("/forgot-password")) {
    return <CommonTopBar title={`忘記密碼`} className="nc-LoginTopBar" />;
  } 


  if (pathname && pathname.endsWith( "/reset-password")){
    return <CommonTopBar title="重設密碼" className="nc-LoginTopBar" />;
  }

  if (pathname && pathname.endsWith( "/reset-password-success")){
    return <CommonTopBar title="重設密碼" className="nc-LoginTopBar" />;
  }


  if (pathname && pathname.endsWith( "/verify-otp")){
    return <CommonTopBar title="" className="nc-LoginTopBar" />;
  }
  
  if (pathname && pathname.endsWith( "/signup-success")){
    return <CommonTopBar title="" className="nc-LoginTopBar" />;
  }

  
  if (pathname && pathname.endsWith( "/signup")){
    return <CommonTopBar title="創建帳戶" className="nc-LoginTopBar" />;
  }


  if (PAGES_REAL_ESTATE.includes(pathname as PathName)) {
    return <HeroSearchForm2RealEstateMobile />;
  }
  return <HeroSearchForm2Mobile />;
};

export default HeroSearchForm2MobileFactory;
