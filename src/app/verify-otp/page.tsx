"use client";

import React, { FC, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Route } from "@/routers/types";
import OTPVerification from "@/components/auth/OTPVerification";
import { ApiUtils } from "@/utils/ApiUtils";

export interface PageVerifyOTPProps {}

const PageVerifyOTP: FC<PageVerifyOTPProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  useEffect(() => {
    // Check if token exists in URL
    if (!token) {
      router.push("/signup" as Route);
    }
  }, [token, router]);

  const handleVerify = async (otp: string) => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('verify-otp'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to success page
        router.push("/signup-success" as Route);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || "驗證碼錯誤，請重試" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "驗證失敗，請重試" 
      };
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(ApiUtils.getAuthUrl('resend-otp'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || "重發驗證碼失敗，請重試" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "重發驗證碼失敗，請重試" 
      };
    }
  };

  if (!token) {
    return null;
  }

  return (
    <OTPVerification
      userType="student"
      email=""
      onVerify={handleVerify}
      onResendOTP={handleResendOTP}
    />
  );
};

export default PageVerifyOTP; 