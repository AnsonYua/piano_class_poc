"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ApiUtils } from "@/utils/ApiUtils";

const TeacherLoginPage: FC = () => {
  const router = useRouter();
  const { checkAuth } = useAuthRedirect();
  
  // Call checkAuth directly in the component
  checkAuth();

  const handleLogin = async (data: { contactNumber: string; password: string }) => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('login', 'teacher'), {
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
        localStorage.setItem('teacher_auth_token', responseData.token);
        router.push('/teacher-admin/dashboard' as Route<string>);
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
      title="導師登入"
      onSubmit={handleLogin}
      redirectPath={"/teacher-admin/dashboard" as Route<string>}
      forgotPasswordPath={"/teacher-admin/forgot-password" as Route<string>}
      signupPath={"/teacher-admin/signup" as Route<string>}
    />
  );
};

export default TeacherLoginPage; 