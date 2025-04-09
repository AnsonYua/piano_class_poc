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
  
  if (pathname === "/login") {
    return <CommonTopBar title="登入" className="nc-LoginTopBar" />;
  } 
  
  if (pathname === "/teacher-admin/login") {
    return <CommonTopBar title="導師登入" className="nc-LoginTopBar" />;
  }
  
  if (pathname === "/shop-owner-admin/login") {
    return <CommonTopBar title="琴行登入" className="nc-LoginTopBar" />;
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
