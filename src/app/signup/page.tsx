"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";
import SignupPageLayout from "@/shared/SignupPageLayout";
import SignupForm from "@/shared/SignupForm";
import { ApiUtils } from "@/utils/ApiUtils";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: any) => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('signup'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Redirect to OTP verification page with phone number
        router.push(`/verify-otp?token=${responseData.token}` as Route);
        return null; // No error message
      } else {
        return responseData.message || "註冊失敗，請重試";
      }
    } catch (error) {
      return "註冊失敗，請重試";
    }
  };

  return (
    <SignupPageLayout title="創建帳戶">
      <SignupForm userType="student" onSubmit={handleSignup} />
    </SignupPageLayout>
  );
}