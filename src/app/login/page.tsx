"use client";

import React, { FC, useState } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";

export interface PageLoginProps {}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would validate credentials with your backend
    // For this demo, we'll just set a token in localStorage
    localStorage.setItem("auth_token", "demo_token");
    
    // Redirect to home page
    router.push("/" as Route);
  };

  return (
    <div className={`nc-PageLogin`}>
      <div className="container mb-24 lg:mb-32">
        {
        <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          登入
        </h2>}
        <div className="my-2 flex md:hidden items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          <br/>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          {/*}
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          */}
          {/* OR 
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          */}
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit} autoComplete="off">
            <input type="text" style={{ display: 'none' }} autoComplete="off" />
            
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                電話號碼
              </span>
              <Input
                type="email"
                name={`email-${Date.now()}`}
                placeholder="請輸入聯絡電話"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-email"
              />
            </label>
            
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                密碼
                <Link href={"/login" as Route} className="text-sm underline font-medium">
                  忘記密碼
                </Link>
              </span>
              <Input
                type="password"
                name={`password-${Date.now()}`}
                placeholder="請輸入密碼"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <ButtonPrimary type="submit">確定</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            沒有帳號? {` `}
            <Link href={"/signup" as Route} className="font-semibold underline">
            創建帳戶
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
