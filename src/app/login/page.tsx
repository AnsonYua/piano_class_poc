"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";

const PageLogin: FC = () => {
  return (
    <LoginForm
      title="登入"
      apiEndpoint="http://localhost:3001/api/auth/login"
      tokenKey="auth_token"
      redirectPath="/"
      forgotPasswordPath="/forgot-password"
      signupPath="/signup"
    />
  );
};

export default PageLogin;
