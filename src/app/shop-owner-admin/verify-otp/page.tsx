'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OTPVerification from '@/components/auth/OTPVerification';
import { Route } from '@/routers/types';

export default function ShopOwnerOTPVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  const handleVerify = async (otp: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp`, {
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
        // Redirect to shop owner admin dashboard
        router.push("/shop-owner-admin/dashboard" as Route);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-otp`, {
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
          message: data.message || "發送失敗，請重試" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "發送失敗，請重試" 
      };
    }
  };

  if (!token) {
    return null;
  }

  return (
    <OTPVerification
      userType="shop-owner"
      email=""
      onVerify={handleVerify}
      onResendOTP={handleResendOTP}
    />
  );
} 