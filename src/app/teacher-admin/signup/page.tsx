"use client";

import React from "react";
import SignupForm from "@/shared/SignupForm";
import SignupPageLayout from "@/shared/SignupPageLayout";

export default function TeacherSignupPage() {
  const handleSignup = async (data: any) => {
    // Handle teacher signup data
    console.log("Teacher signup data:", data);
  };

  return (
    <SignupPageLayout title="教師註冊">
      <SignupForm userType="teacher" onSubmit={handleSignup} />
    </SignupPageLayout>
  );
} 