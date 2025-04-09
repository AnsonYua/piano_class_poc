'use client';

import Link from 'next/link';
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "@/routers/types";

interface ResetPasswordSuccessPageProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  loginPath: string;
}

export default function ResetPasswordSuccessPage({ userType, loginPath }: ResetPasswordSuccessPageProps) {
  const getTitle = () => {
    switch (userType) {
      case 'teacher':
        return '導師密碼重設成功';
      case 'shop-owner':
        return '琴行密碼重設成功';
      default:
        return '密碼重設成功';
    }
  };

  return (
    <div className="nc-PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          {getTitle()}
        </h2>
        <div className="my-2 flex md:hidden items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          <br/>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center text-neutral-800 dark:text-neutral-200">
            您的密碼已經成功重設，請使用新密碼登入
          </div>
          <div>
            <Link href={loginPath as Route}>
              <ButtonPrimary className="w-full">
                返回登入
              </ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 