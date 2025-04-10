"use client";

import React, { FC, useEffect } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";
import { useRouter } from "next/navigation";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";

const PageLogin: FC = () => {
  const router = useRouter();
  const userType: UserType = 'student';
  
  // Check if student is already logged in
  useEffect(() => {
    const token = localStorage.getItem(`${userType}_auth_token`);
    if (token) {
      const homepageUrl = UserTypeUtils.getHomepageUrl(userType);
      router.push(homepageUrl);
    }
  }, [router, userType]);

  const handleLogin = async (data: { contactNumber: string; password: string }) => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('login', userType), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: data.contactNumber.startsWith('852') ? data.contactNumber : `852${data.contactNumber}`,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem(`${userType}_auth_token`, responseData.token);
        const homepageUrl = UserTypeUtils.getHomepageUrl(userType);
        router.push(homepageUrl);
        return null; // No error message
      } else {
        return responseData.message || '登入失敗，請重試';
      }
    } catch (error) {
      return '登入失敗，請重試';
    }
  };

  return (
    <LoginForm
      title="學生登入"
      onSubmit={handleLogin}
      redirectPath={UserTypeUtils.getHomepageUrl(userType) as Route<string>}
      forgotPasswordPath={`${UserTypeUtils.getHomepageUrl(userType)}/forgot-password` as Route<string>}
      signupPath={`${UserTypeUtils.getHomepageUrl(userType)}/signup` as Route<string>}
    />
  );
};

export default PageLogin;
