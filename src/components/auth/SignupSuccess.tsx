"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface SignupSuccessProps {
  userType: "student" | "teacher" | "shop-owner";
}

const SignupSuccess: FC<SignupSuccessProps> = ({ userType }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const getLoginRoute = () => {
    switch (userType) {
      case "student":
        return "/login" as Route;
      case "teacher":
        return "/teacher-admin/login" as Route;
      case "shop-owner":
        return "/shop-owner-admin/login" as Route;
      default:
        return "/login" as Route;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push(getLoginRoute());
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, userType]);

  const getTitle = () => {
    switch (userType) {
      case "student":
        return "學生註冊成功！";
      case "teacher":
        return "老師註冊成功！";
      case "shop-owner":
        return "琴行註冊成功！";
      default:
        return "註冊成功！";
    }
  };

  return (
    <div className="nc-PageSignUpSuccess min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {getTitle()}
            </h2>
            
            <p className="text-neutral-600 dark:text-neutral-400">
              您的帳戶已成功創建。您將在 <span className="font-bold text-blue-600 dark:text-blue-400">{countdown}</span> 秒後自動跳轉到登入頁面。
            </p>
            
            <ButtonPrimary 
              onClick={() => router.push(getLoginRoute())} 
              className="w-full py-3 text-base"
            >
              立即登入
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess; 