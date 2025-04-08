"use client";

import React, { FC } from "react";
import LoginForm from "@/shared/LoginForm";
import { Route } from "@/routers/types";

const PageLogin: FC = () => {
  return (
    <LoginForm
      title="老師登入"
      apiEndpoint="http://localhost:3001/api/auth/teacher/login"
      tokenKey="teacher_auth_token"
      redirectPath={"/teacher-admin/dashboard" as Route}
      forgotPasswordPath={"/teacher-admin/forgot-password" as Route}
      signupPath={"/teacher-admin/signup" as Route}
    />
  );
};

export default PageLogin; 