'use client';

import Link from 'next/link';
import ResetPasswordForm from './ResetPasswordForm';
import { Route } from "@/routers/types";

interface ResetPasswordPageProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  redirectPath: string;
  loginPath: string;
}

export default function ResetPasswordPage({ userType, redirectPath, loginPath }: ResetPasswordPageProps) {
  const getTitle = () => {
    switch (userType) {
      case 'teacher':
        return '導師重設密碼';
      case 'shop-owner':
        return '琴行重設密碼';
      default:
        return '重設密碼';
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
        
        <ResetPasswordForm userType={userType} redirectPath={redirectPath} />
        
        <div className="mt-6 text-center">
          <Link href={loginPath as Route} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400">
            返回登入
          </Link>
        </div>
      </div>
    </div>
  );
} 