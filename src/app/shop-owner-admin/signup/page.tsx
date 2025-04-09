"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";
import SignupPageLayout from "@/shared/SignupPageLayout";
import SignupForm from "@/shared/SignupForm";

export default function ShopOwnerSignupPage() {
  const router = useRouter();

  const handleSignup = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/shop-owner/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Redirect to OTP verification page with phone number
        router.push(`/shop-owner-admin/verify-otp?token=${responseData.token}` as Route);
        return null; // No error message
      } else {
        return responseData.message || "註冊失敗，請重試";
      }
    } catch (error) {
      return "註冊失敗，請重試";
    }
  };

  return (
    <SignupPageLayout title="琴行註冊">
      <SignupForm userType="shop-owner" onSubmit={handleSignup} />
    </SignupPageLayout>
  );
} 