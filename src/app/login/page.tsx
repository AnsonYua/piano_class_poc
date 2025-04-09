"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const PageLogin: FC = () => {
  const router = useRouter();
  const { checkAuth } = useAuthRedirect();
  
  // Call checkAuth directly in the component
  checkAuth();

  const handleLogin = async (data: { contactNumber: string; password: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
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
        localStorage.setItem('student_auth_token', responseData.token);
        router.push('/my-reservations' as Route<string>);
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
      redirectPath={"/my-reservations" as Route<string>}
      forgotPasswordPath={"/forgot-password" as Route<string>}
      signupPath={"/signup" as Route<string>}
    />
  );
};

export default PageLogin;
