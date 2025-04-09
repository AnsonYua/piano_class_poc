"use client";

import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface AdminSignupSuccessProps {
  userType: "teacher" | "shop-owner";
}

const AdminSignupSuccess: FC<AdminSignupSuccessProps> = ({ userType }) => {
  const router = useRouter();

  const getMainRoute = () => {
    return `/${userType}-admin` as Route;
  };

  const getTitle = () => {
    switch (userType) {
      case "teacher":
        return "導師註冊成功！";
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
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {getTitle()}
            </h2>
            
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              帳號註冊成功，我們將儘快聯絡您以完成整個註冊流程。
            </p>
            
            <div className="pt-4">
              <ButtonPrimary 
                onClick={() => router.push(getMainRoute())} 
                className="w-full py-3 text-base"
              >
                返回主頁
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupSuccess; 