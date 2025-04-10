"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ApiUtils } from "@/utils/ApiUtils";

const ShopOwnerLoginPage: FC = () => {
  const router = useRouter();
  const { checkAuth } = useAuthRedirect();
  
  // Call checkAuth directly in the component
  checkAuth();

  const handleLogin = async (data: { contactNumber: string; password: string }) => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('login', 'shop-owner'), {
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
        localStorage.setItem('shop_owner_auth_token', responseData.token);
        router.push('/shop-owner-admin/dashboard' as Route<string>);
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
      title="琴行登入"
      onSubmit={handleLogin}
      redirectPath={"/shop-owner-admin/dashboard" as Route<string>}
      forgotPasswordPath={"/shop-owner-admin/forgot-password" as Route<string>}
      signupPath={"/shop-owner-admin/signup" as Route<string>}
    />
  );
};

export default ShopOwnerLoginPage; 