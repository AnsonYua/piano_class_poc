import React from "react";
import Image from "next/image";
import logonew from "@/images/logonew.png";

const LogoSvg = () => {
  return (
    <Image 
      src={logonew} 
      alt="logo" 
      className="w-full block dark:hidden"
    />
  );
};

export default LogoSvg;
