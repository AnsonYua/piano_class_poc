import React, { useEffect, useState } from "react";
import logoImg from "@/images/logo.png";
import logoLightImg from "@/images/logo-light.png";
import LogoSvgLight from "./LogoSvgLight";
import LogoSvg from "./LogoSvg";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";
import { usePathname } from "next/navigation";
import { Route } from "@/routers/types";

export interface LogoProps {
  img?: StaticImageData;
  imgLight?: StaticImageData;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "w-24",
}) => {
  const pathname = usePathname() || "";
  const [homepageUrl, setHomepageUrl] = useState<Route<string>>("/" as Route<string>);
  
  useEffect(() => {
    // Determine user type based on current pathname
    const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
    // Get the appropriate homepage URL
    const url = UserTypeUtils.getHomepageUrl(userType);
    setHomepageUrl(url);
  }, [pathname]);

  return (
    <Link
      href={homepageUrl}
      className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}
    >
      <LogoSvgLight />
      <LogoSvg />

      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {/* {img ? (
        <img
          className={`block max-h-12 ${imgLight ? "dark:hidden" : ""}`}
          src={img}
          alt="Logo"
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <img
          className="hidden max-h-12 dark:block"
          src={imgLight}
          alt="Logo-Light"
        />
      )} */}
    </Link>
  );
};

export default Logo;
