"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";

const PageLogin: FC = () => {
  return (
    <LoginForm
      title="琴行登入"
      apiEndpoint="http://localhost:3001/api/auth/shop-owner/login"
      tokenKey="shop_owner_auth_token"
      redirectPath={"/shop-owner-admin/dashboard" as Route}
      forgotPasswordPath={"/shop-owner-admin/forgot-password" as Route}
      signupPath={"/shop-owner-admin/signup" as Route}
    />
  );
};

export default PageLogin; 