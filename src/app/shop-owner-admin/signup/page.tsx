"use client";

import React from "react";
import SignupForm from "@/shared/SignupForm";
import SignupPageLayout from "@/shared/SignupPageLayout";

export default function ShopOwnerSignupPage() {
  const handleSignup = async (data: any) => {
    // Handle shop owner signup data
    console.log("Shop owner signup data:", data);
  };

  return (
    <SignupPageLayout title="琴行註冊">
      <SignupForm userType="shop-owner" onSubmit={handleSignup} />
    </SignupPageLayout>
  );
} 